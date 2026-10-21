"""Arrange existing Phase 3/4 evidence without changing the source images."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "contact-sheet.png"
ROWS = [
    ("01 Overview", "01-overview.png", "overview"),
    ("02 Seat front", "02-seat-front.png", "seat-front"),
    ("03 Seat detail", "03-seat-detail.png", "seat-detail"),
    ("04 OLED front", "04-oled-front.png", "oled-front"),
    ("05 OLED profile", "05-oled-profile.png", "oled-profile"),
]
COLUMNS = [
    ("Blender Cycles CPU", 720),
    ("Desktop browser", 720),
    ("Mobile browser", 360),
    ("Owner reference", 560),
]
MARGIN = 24
GAP = 24
HEADER = 142
ROW_HEIGHT = 710
FOOTER = 76
WIDTH = MARGIN * 2 + sum(width for _, width in COLUMNS) + GAP * (len(COLUMNS) - 1)
HEIGHT = HEADER + ROW_HEIGHT * len(ROWS) + FOOTER


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    system_font = Path("C:/Windows/Fonts/arial.ttf")
    return ImageFont.truetype(str(system_font), size) if system_font.exists() else ImageFont.load_default()


TITLE = font(32)
LABEL = font(23)
SMALL = font(18)


def place(draw: ImageDraw.ImageDraw, sheet: Image.Image, path: Path, x: int, y: int, width: int) -> None:
    if not path.is_file():
        raise FileNotFoundError(path)
    with Image.open(path) as source:
        tile = ImageOps.contain(source.convert("RGB"), (width - 20, ROW_HEIGHT - 92), Image.Resampling.LANCZOS)
    sheet.paste(tile, (x + (width - tile.width) // 2, y + 52 + (ROW_HEIGHT - 92 - tile.height) // 2))
    draw.text((x + 12, y + ROW_HEIGHT - 30), path.name, fill="#b8c8d7", font=SMALL)


def main() -> None:
    sheet = Image.new("RGB", (WIDTH, HEIGHT), "#11151a")
    draw = ImageDraw.Draw(sheet)
    draw.text((MARGIN, 19), "PROVISIONAL V223 two-node spike - comparison sheet", fill="#f2f6fb", font=TITLE)
    draw.text((MARGIN, 66), "Technical evidence only. Cameras/lighting differ; this sheet is not a visual acceptance score.", fill="#c7d4df", font=LABEL)
    draw.text((MARGIN, 101), "GATE-01 / GATE-08 / GATE-11 OPEN  |  WebP feasibility waiver  |  No owner physical photos supplied", fill="#ffca72", font=SMALL)

    positions = []
    cursor = MARGIN
    for _, width in COLUMNS:
        positions.append(cursor)
        cursor += width + GAP
    for index, (name, blender_file, slug) in enumerate(ROWS):
        top = HEADER + index * ROW_HEIGHT
        for column_index, ((heading, width), x) in enumerate(zip(COLUMNS, positions)):
            draw.rounded_rectangle((x, top + 38, x + width, top + ROW_HEIGHT - 4), radius=12, fill="#1d242b", outline="#394650", width=2)
            caption = f"{name} | {heading}" if column_index == 0 else heading
            draw.text((x + 12, top + 10), caption, fill="#f2f6fb", font=SMALL)
        place(draw, sheet, ROOT / blender_file, positions[0], top, COLUMNS[0][1])
        place(draw, sheet, ROOT / "viewer" / f"desktop-{slug}.png", positions[1], top, COLUMNS[1][1])
        place(draw, sheet, ROOT / "viewer" / f"mobile-{slug}.png", positions[2], top, COLUMNS[2][1])
        x = positions[3]
        draw.text((x + 25, top + 220), "NOT SUPPLIED", fill="#ffca72", font=TITLE)
        draw.text((x + 25, top + 278), "Physical vehicle / hide photo", fill="#c7d4df", font=LABEL)
        draw.text((x + 25, top + 314), "needed for final comparison.", fill="#c7d4df", font=LABEL)
        draw.text((x + 25, top + ROW_HEIGHT - 30), "Published source URLs: review.md", fill="#b8c8d7", font=SMALL)

    draw.text((MARGIN, HEIGHT - 53), "Original images remain in this folder and viewer/. No source pixels were retouched.", fill="#c7d4df", font=SMALL)
    sheet.save(OUTPUT, optimize=True)
    print(f"Wrote {OUTPUT} ({WIDTH} x {HEIGHT})")


if __name__ == "__main__":
    main()
