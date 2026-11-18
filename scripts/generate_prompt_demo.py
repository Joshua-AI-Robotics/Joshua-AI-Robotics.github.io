import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROMPT = "Build and validate my robot arm’s control pipeline with Joshua MCP."
OUTPUT = Path(__file__).resolve().parents[1] / "assets/images"


def lines_for(text, font, width):
    lines = [""]
    for word in text.split(" "):
        candidate = (lines[-1] + " " + word).lstrip()
        if font.getlength(candidate) > width:
            lines.append(word)
        else:
            lines[-1] = candidate
    return lines


def frame(text, size, font, cursor=True):
    width, height = size
    image = Image.new("RGB", size, "white")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(
        (2, 2, width - 3, height - 3),
        radius=22,
        fill="white",
        outline="#d9d9de",
        width=2,
    )
    padding = 38 if width > 700 else 30
    lines = lines_for(text, font, width - 2 * padding - 10)
    line_height = int(font.size * 1.45)
    y = (height - len(lines) * line_height) / 2
    if not text:
        draw.text(
            (padding, y),
            "Ask your AI assistant…",
            font=font,
            fill="#86868b",
            anchor="lt",
        )
    else:
        for index, line in enumerate(lines):
            draw.text(
                (padding, y + index * line_height),
                line,
                font=font,
                fill="#1d1d1f",
                anchor="lt",
            )
    if cursor:
        x = padding + font.getlength(lines[-1]) + 3
        top = y + (len(lines) - 1) * line_height
        draw.line((x, top, x, top + font.size + 2), fill="#0071e3", width=2)
    return image


def generate(font_path, suffix, size, font_size):
    font = ImageFont.truetype(str(font_path), font_size)
    final = frame(PROMPT, size, font, cursor=False)
    final.save(OUTPUT / ("joshua-mcp-prompt" + suffix + ".png"))
    palette = final.quantize(colors=64)
    frames = [frame("", size, font)]
    durations = [600]
    for index in range(1, len(PROMPT) + 1):
        frames.append(frame(PROMPT[:index], size, font))
        durations.append(50)
    for index in range(8):
        frames.append(frame(PROMPT, size, font, cursor=index % 2 == 0))
        durations.append(200)
    frames = [
        image.quantize(palette=palette, dither=Image.Dither.NONE) for image in frames
    ]
    destination = OUTPUT / ("joshua-mcp-prompt" + suffix + ".gif")
    frames[0].save(
        destination,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=1,
    )
    print(destination.name, destination.stat().st_size, "bytes")


def main():
    parser = argparse.ArgumentParser(
        description="Render the Joshua MCP prompt typing example"
    )
    parser.add_argument(
        "--font",
        type=Path,
        default=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    )
    args = parser.parse_args()
    generate(args.font, "", (1280, 184), 32)
    generate(args.font, "-mobile", (640, 250), 30)


if __name__ == "__main__":
    main()
