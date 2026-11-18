import argparse
import datetime
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import urlsplit


SITE = Path(__file__).resolve().parents[1]


def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args])


def build(root, revision):
    revision = (
        git(root, "rev-parse", "--verify", revision + "^{commit}").decode().strip()
    )
    targets = json.loads((SITE / "data/integration-targets.json").read_text())
    if targets["schema_version"] != 1:
        raise ValueError("Unsupported target snapshot version")
    datetime.date.fromisoformat(targets["snapshot_date"])
    paths = set(
        git(root, "ls-tree", "-r", "--name-only", revision).decode().splitlines()
    )
    catalog_directory = "docs/hardware_catalog/"
    if catalog_directory + "catalog.schema.json" not in paths:
        raise ValueError(
            "The selected Joshua revision needs the version 2 hardware catalog"
        )
    devices = {}
    for path in sorted(paths):
        if not path.startswith(catalog_directory) or not path.endswith(".json"):
            continue
        relative = path[len(catalog_directory) :]
        if "/" in relative or relative == "catalog.schema.json":
            continue
        device = json.loads(git(root, "show", revision + ":" + path))
        if device["schema_version"] != 2 or relative != device["id"] + ".json":
            raise ValueError("Invalid catalog device identity: " + path)
        if device["integration"]["status"] not in (
            "candidate",
            "integrated",
            "unsupported",
            "retired",
        ):
            raise ValueError("Invalid integration status: " + path)
        devices[device["id"]] = device
    if not devices:
        raise ValueError("The hardware catalog must not be empty")
    mapped = set()
    for entry in targets["hardware"]:
        ident = entry.get("catalog_id", entry["id"])
        if ident in mapped:
            raise ValueError("Repeated catalog mapping: " + ident)
        mapped.add(ident)
    exclusions = targets.get("coverage_exclusions", {})
    categories = {
        "board": "Compute & boards",
        "host": "Compute & boards",
        "camera": "Cameras",
        "actuator": "Actuators",
        "sensor": "Sensors",
        "motor_driver": "Motor controllers",
        "assembly": "Robot assemblies",
        "transport_adapter": "Communication adapters",
        "power": "Power",
        "other": "Other hardware",
    }
    for ident, device in sorted(devices.items()):
        if ident not in mapped:
            targets["hardware"].append(
                {
                    "id": ident,
                    "name": device["model"],
                    "vendor": device["manufacturer"],
                    "category": categories[device["kind"]],
                    "source_url": "https://github.com/Joshua-AI-Robotics/Joshua/blob/"
                    + revision
                    + "/"
                    + catalog_directory
                    + ident
                    + ".json",
                    "aliases": device["aliases"],
                    "catalog_id": ident,
                }
            )
    result = {
        "snapshot_date": targets["snapshot_date"],
        "joshua_revision": revision,
    }
    repository = "https://github.com/Joshua-AI-Robotics/Joshua/blob/" + revision + "/"
    for kind in ("hardware", "software"):
        entries = []
        identities = set()
        implementations = set()
        for target in targets[kind]:
            entry = dict(target)
            ident = entry["id"]
            if (
                not re.fullmatch(r"[a-z][a-z0-9_-]{0,127}", ident)
                or ident in identities
            ):
                raise ValueError("Invalid or repeated target identity: " + ident)
            identities.add(ident)
            if any(
                not isinstance(entry[k], str) or not entry[k].strip()
                for k in ("name", "vendor", "category")
            ):
                raise ValueError("Missing target name, vendor or category: " + ident)
            source = urlsplit(entry["source_url"])
            if source.scheme != "https" or not source.netloc:
                raise ValueError("A target needs an HTTPS primary source: " + ident)
            if not isinstance(entry["aliases"], list) or any(
                not isinstance(alias, str) for alias in entry["aliases"]
            ):
                raise ValueError("Invalid aliases: " + ident)
            entry["integrated"] = False
            entry["status"] = "candidate"
            entry["counts_toward_coverage"] = True
            entry["implementation_url"] = None
            if kind == "hardware":
                catalog_id = entry.get("catalog_id", ident)
                if not re.fullmatch(r"[a-z][a-z0-9_-]{0,127}", catalog_id):
                    raise ValueError("Invalid catalog identity: " + ident)
                path = "docs/hardware_catalog/" + catalog_id + ".json"
                if entry.get("catalog_id") and path not in paths:
                    raise ValueError(
                        "Catalog mapping is missing at the selected revision: " + path
                    )
                if path in paths:
                    device = devices[catalog_id]
                    if device["schema_version"] != 2 or device["id"] != catalog_id:
                        raise ValueError("Unsupported device record: " + path)
                    entry["capabilities"] = device.get("capabilities", [])
                    entry["status"] = device["integration"]["status"]
                    entry["integrated"] = entry["status"] == "integrated"
                    if catalog_id in exclusions:
                        if (
                            not isinstance(exclusions[catalog_id], str)
                            or not exclusions[catalog_id].strip()
                        ):
                            raise ValueError(
                                "A coverage exclusion needs a reason: " + catalog_id
                            )
                        entry["counts_toward_coverage"] = False
                        entry["coverage_exclusion"] = exclusions[catalog_id]
                    entry["implementation_url"] = repository + path
                    entry["aliases"] = sorted(set(entry["aliases"] + device["aliases"]))
                    if entry["integrated"]:
                        if not device["integration"]["implementations"]:
                            raise ValueError(
                                "Integrated device has no implementation: " + ident
                            )
                        for implementation in device["integration"]["implementations"]:
                            if implementation not in paths:
                                raise ValueError(
                                    "Missing device implementation: " + implementation
                                )
            else:
                if entry["category"] not in (
                    "Device drivers and SDKs",
                    "Sensor capture",
                    "Hardware control",
                    "Device communication",
                ):
                    raise ValueError(
                        "Software must directly serve device I/O: " + ident
                    )
                path = entry.get("joshua_source")
                if path:
                    if path not in paths:
                        raise ValueError(
                            "Software mapping is missing at the selected revision: "
                            + path
                        )
                    entry["integrated"] = True
                    entry["status"] = "integrated"
                    entry["implementation_url"] = repository + path
            if entry["integrated"]:
                if entry["implementation_url"] in implementations:
                    raise ValueError(
                        "Two targets count the same implementation: " + ident
                    )
                implementations.add(entry["implementation_url"])
            entries.append(entry)
        if not entries or not any(e["counts_toward_coverage"] for e in entries):
            raise ValueError("The coverage target set must not be empty: " + kind)
        result[kind] = entries
    return result


def main():
    parser = argparse.ArgumentParser(
        description="Build the site's catalog from a committed Joshua revision"
    )
    parser.add_argument("--joshua-root", type=Path, required=True)
    parser.add_argument("--revision", default="HEAD")
    args = parser.parse_args()
    data = build(args.joshua_root, args.revision)
    output = SITE / "js/integrations-data.js"
    output.write_text(
        "window.JOSHUA_INTEGRATIONS = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n"
    )
    for kind in ("hardware", "software"):
        entries = data[kind]
        counted = [entry for entry in entries if entry["counts_toward_coverage"]]
        print(
            f"{kind}: {sum(entry['integrated'] for entry in counted)}/{len(counted)}; {len(entries)} searchable"
        )


if __name__ == "__main__":
    main()
