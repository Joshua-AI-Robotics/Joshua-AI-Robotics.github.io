import copy
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import update_integrations as generator


class CatalogGenerationTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        root = Path(self.temporary.name)
        self.repository = root / "joshua"
        self.site = root / "site"
        self.repository.mkdir()
        (self.site / "data").mkdir(parents=True)
        self.git("init", "-q")
        self.device = {
            "schema_version": 2,
            "id": "vendor-board",
            "kind": "board",
            "manufacturer": "Vendor",
            "model": "Board",
            "aliases": ["Original board"],
            "integration": {
                "status": "integrated",
                "implementations": ["robot/board.cc"],
            },
        }
        self.targets = {
            "schema_version": 1,
            "snapshot_date": "2026-11-18",
            "hardware": [
                {
                    "id": "legacy-board",
                    "catalog_id": "vendor-board",
                    "name": "Board",
                    "vendor": "Vendor",
                    "category": "Compute & boards",
                    "source_url": "https://example.test/board",
                    "aliases": [],
                }
            ],
            "software": [
                {
                    "id": "capture-library",
                    "name": "Capture",
                    "vendor": "Vendor",
                    "category": "Sensor capture",
                    "source_url": "https://example.test/capture",
                    "aliases": [],
                    "joshua_source": "robot/capture.cc",
                }
            ],
        }
        self.write_targets()
        self.write("docs/hardware_catalog/catalog.schema.json", "{}")
        self.write_device(self.device)
        self.write("robot/board.cc", "int board_driver;\n")
        self.write("robot/capture.cc", "int capture_driver;\n")
        self.commit()

    def git(self, *args):
        return subprocess.check_output(
            [
                "git",
                "-c",
                "user.name=Catalog test",
                "-c",
                "user.email=catalog-test@example.test",
                "-c",
                "commit.gpgsign=false",
                "-c",
                "core.hooksPath=/dev/null",
                "-C",
                str(self.repository),
                *args,
            ]
        )

    def write(self, path, content):
        destination = self.repository / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content)

    def write_device(self, device):
        self.write(
            "docs/hardware_catalog/" + device["id"] + ".json", json.dumps(device)
        )

    def write_targets(self):
        (self.site / "data/integration-targets.json").write_text(
            json.dumps(self.targets)
        )

    def commit(self):
        self.git("add", ".")
        self.git("commit", "-qm", "Catalog fixture")

    def build(self):
        with patch.object(generator, "SITE", self.site):
            return generator.build(self.repository, "HEAD")

    def test_committed_snapshot_aliases_and_determinism(self):
        result = self.build()
        self.assertEqual(result, self.build())
        self.assertEqual(len(result["hardware"]), 1)
        board = result["hardware"][0]
        self.assertEqual(board["status"], "integrated")
        self.assertTrue(board["counts_toward_coverage"])
        self.assertIn("Original board", board["aliases"])
        self.assertIn(result["joshua_revision"], board["implementation_url"])
        self.device["integration"]["status"] = "retired"
        self.write_device(self.device)
        self.assertEqual(self.build(), result)

    def test_new_catalog_device_appears_without_website_edit(self):
        original = (self.site / "data/integration-targets.json").read_bytes()
        device = copy.deepcopy(self.device)
        device.update(id="new-camera", kind="camera", model="New camera")
        self.write_device(device)
        self.commit()
        result = self.build()
        camera = next(e for e in result["hardware"] if e["id"] == "new-camera")
        self.assertEqual(camera["category"], "Cameras")
        self.assertTrue(camera["integrated"])
        self.assertTrue(camera["counts_toward_coverage"])
        self.assertEqual(
            (self.site / "data/integration-targets.json").read_bytes(), original
        )

    def test_candidates_and_catalog_statuses_are_preserved(self):
        candidate = copy.deepcopy(self.targets["hardware"][0])
        candidate.update(
            id="vendor-future", catalog_id="vendor-future", name="Future board"
        )
        candidate.pop("catalog_id")
        self.targets["hardware"].append(candidate)
        self.write_targets()
        self.device["integration"]["status"] = "unsupported"
        self.write_device(self.device)
        self.commit()
        result = self.build()
        self.assertEqual(
            [e["status"] for e in result["hardware"]], ["unsupported", "candidate"]
        )
        self.assertFalse(any(e["integrated"] for e in result["hardware"]))

    def test_excluded_family_remains_searchable(self):
        extra = copy.deepcopy(self.targets["hardware"][0])
        extra.update(id="vendor-future", name="Future board")
        extra.pop("catalog_id")
        self.targets["hardware"].append(extra)
        self.targets["coverage_exclusions"] = {
            "vendor-board": "Family overlaps named variants"
        }
        self.write_targets()
        entry = self.build()["hardware"][0]
        self.assertFalse(entry["counts_toward_coverage"])
        self.assertEqual(entry["coverage_exclusion"], "Family overlaps named variants")

    def test_invalid_target_snapshots_are_rejected(self):
        original = copy.deepcopy(self.targets)
        for invalid in ("identity", "mapping", "category", "source", "implementation"):
            with self.subTest(invalid=invalid):
                self.targets = copy.deepcopy(original)
                if invalid == "identity":
                    self.targets["software"].append(
                        copy.deepcopy(self.targets["software"][0])
                    )
                elif invalid == "mapping":
                    entry = copy.deepcopy(self.targets["hardware"][0])
                    entry["id"] = "duplicate-alias"
                    self.targets["hardware"].append(entry)
                elif invalid == "category":
                    self.targets["software"][0]["category"] = "Simulation"
                elif invalid == "source":
                    self.targets["software"][0]["source_url"] = "javascript:alert(1)"
                else:
                    self.targets["software"][0]["joshua_source"] = "missing.cc"
                self.write_targets()
                with self.assertRaises(ValueError):
                    self.build()

    def test_missing_catalog_and_false_support_fail_closed(self):
        self.device["integration"]["implementations"] = []
        self.write_device(self.device)
        self.commit()
        with self.assertRaises(ValueError):
            self.build()
        self.git("rm", "docs/hardware_catalog/catalog.schema.json")
        self.commit()
        with self.assertRaisesRegex(ValueError, "version 2 hardware catalog"):
            self.build()


if __name__ == "__main__":
    unittest.main()
