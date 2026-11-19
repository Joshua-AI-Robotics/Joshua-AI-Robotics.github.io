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
    heading = ImageFont.truetype(font.path, 30)
    small = ImageFont.truetype(font.path, 26)
    icon = ImageFont.truetype(font.path, 28)
    draw.rounded_rectangle(
        (2, 2, width - 3, height - 3),
        radius=24,
        fill="white",
        outline="#d9d9de",
        width=2,
    )
    draw.line((2, 88, width - 3, 88), fill="#e8e8ed", width=2)
    draw.rounded_rectangle((28, 24, 72, 68), radius=13, fill="#1d1d1f")
    draw.text((50, 46), "J", font=icon, fill="white", anchor="mm")
    draw.text((90, 46), "AI assistant", font=heading, fill="#1d1d1f", anchor="lm")
    badge_width = int(small.getlength("Joshua MCP")) + 30
    badge_left = width - badge_width - 28
    draw.rounded_rectangle((badge_left, 26, width - 28, 66), radius=20, fill="#f0f0f3")
    draw.text(
        (badge_left + 15, 46), "Joshua MCP", font=small, fill="#505057", anchor="lm"
    )
    draw.rounded_rectangle((30, 142, 76, 188), radius=14, fill="#1d1d1f")
    draw.text((53, 165), "J", font=icon, fill="white", anchor="mm")
    draw.text((98, 126), "Assistant", font=small, fill="#6e6e73", anchor="lt")
    draw.text(
        (98, 164),
        "What would you like to build?",
        font=font,
        fill="#1d1d1f",
        anchor="lt",
    )
    draw.text(
        (98, 216),
        "Discover · Configure · Validate",
        font=small,
        fill="#6e6e73",
        anchor="lt",
    )
    top = 300 if width > 700 else 282
    draw.rounded_rectangle(
        (24, top, width - 24, height - 24),
        radius=24,
        fill="#f7f7f9",
        outline="#e0e0e5",
        width=2,
    )
    draw.text((52, top + 20), "You", font=small, fill="#6e6e73", anchor="lt")
    padding = 52
    lines = lines_for(text, font, width - 2 * padding - 10)
    line_height = int(font.size * 1.45)
    y = top + 62
    if not text:
        draw.text(
            (padding, y),
            "Message your AI assistant…",
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
        cursor_y = y + (len(lines) - 1) * line_height
        draw.line((x, cursor_y, x, cursor_y + font.size + 2), fill="#0071e3", width=2)
    draw.text(
        (52, height - 68), "Tools · Joshua MCP", font=small, fill="#6e6e73", anchor="lm"
    )
    send_left = width - 154
    draw.rounded_rectangle(
        (send_left, height - 92, width - 48, height - 44),
        radius=16,
        fill="#1d1d1f" if text else "#bcbcc2",
    )
    draw.text(
        (send_left + 53, height - 68), "Send", font=small, fill="white", anchor="mm"
    )
    return image


def generate(font_path, suffix, size, font_size):
    font = ImageFont.truetype(str(font_path), font_size)
    final = frame(PROMPT, size, font, cursor=False)
    final.save(OUTPUT / ("joshua-mcp-prompt" + suffix + ".png"))
    palette = frame(PROMPT, size, font).quantize(colors=64)
    frames = [frame("", size, font)]
    durations = [450]
    for index in range(1, len(PROMPT) + 1):
        frames.append(frame(PROMPT[:index], size, font))
        durations.append(40)
    frames.append(final)
    durations.append(700)
    frames = [
        image.quantize(palette=palette, dither=Image.Dither.NONE) for image in frames
    ]
    destination = OUTPUT / ("joshua-mcp-prompt" + suffix + ".gif")
    frames[0].save(
        destination,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
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
    generate(args.font, "", (1280, 560), 32)
    generate(args.font, "-mobile", (640, 600), 30)


if __name__ == "__main__":
    main()
