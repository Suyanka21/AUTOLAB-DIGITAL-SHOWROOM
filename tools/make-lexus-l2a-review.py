"""Compose existing render/photo pixels; never generate or retouch geometric evidence.

The photo comparison stays in the ignored, local-only reference pack.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'docs/review/lexus-l2a-2026-10-23'
PACK=ROOT/'AUTOLAB_LEXUS_SEAT_REFERENCE_PACK'
OUT=PACK/'L2A_REVIEW'
OUT.mkdir(parents=True,exist_ok=True)
font_path=Path('C:/Windows/Fonts/arial.ttf')
font=ImageFont.truetype(str(font_path),25)
small=ImageFont.truetype(str(font_path),21)
title=ImageFont.truetype(str(font_path),38)
photo08=PACK/'01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg'
photo23=PACK/'01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg'
rows=[('01-driver-hero.png','Driver Hero',photo08,None,'LRX-08: driver seat, front three-quarter'),
      ('02-open-door-profile.png','Open-Door Profile',photo23,None,'LRX-23: open driver door; not an orthographic view'),
      ('03-seam-macro.png','Seam Macro',photo08,(500,700,1090,1067),'LRX-08 cushion crop: no true stitch/grain macro supplied')]
canvas=Image.new('RGB',(2080,3030),'#eef0f2')
draw=ImageDraw.Draw(canvas)
draw.text((40,25),'Lexus RX 350 / L2A owner visual review',font=title,fill='#18242c')
draw.text((40,80),'INTERNAL PHOTO COMPARISON | Provisional geometry | Visual approval pending',font=font,fill='#18242c')
gate=json.loads((ROOT/'reports/lexus-l2a-report.json').read_text())
render_report=json.loads((REVIEW/'render-report.json').read_text())
assert gate['passed'] and gate['sha256']==render_report['assetSha256'], 'Gate and render asset hashes differ'
assert gate['sha256']==hashlib.sha256((ROOT/'public/assets/3d/lexus-rx350/driver-seat-l2a.glb').read_bytes()).hexdigest()
render_hashes={view['file']:view['sha256'] for view in render_report['views']}
for render,*_ in rows:
    assert hashlib.sha256((REVIEW/render).read_bytes()).hexdigest()==render_hashes[render], 'Stale or altered render: '+render
draw.text((40,120),'Asset SHA-256: '+gate['sha256'],font=small,fill='#39434b')
records=[]
for index,(render,label,photo,crop,caption) in enumerate(rows):
    y=180+index*920
    draw.text((40,y),label+' / delivered geometry + decoded texture pixels',font=small,fill='#18242c')
    draw.text((1060,y),caption,font=small,fill='#18242c')
    for x,path,region in [(40,REVIEW/render,None),(1060,photo,crop)]:
        with Image.open(path) as source:
            source=source.convert('RGB')
            if region:source=source.crop(region)
            panel=ImageOps.contain(source,(980,840),Image.Resampling.LANCZOS)
            canvas.paste(panel,(x+(980-panel.width)//2,y+45+(840-panel.height)//2))
    records.append({'render':render,'reference':str(photo.relative_to(ROOT)),'cropPixels':crop,
                    'renderSha256':hashlib.sha256((REVIEW/render).read_bytes()).hexdigest(),
                    'referenceSha256':hashlib.sha256(photo.read_bytes()).hexdigest()})
draw.text((40,2950),'Scale, stitch pitch, leather grain and exact panel topology remain visual estimates; photographs are not colour calibrated.',font=small,fill='#39434b')
draw.text((40,2985),'LRX-29 is passenger-side context. LRX-31 is rear-cabin/shoulder context, not front-seat stitch-macro evidence.',font=small,fill='#39434b')
destination=OUT/'contact-sheet.png'
canvas.save(destination)
(REVIEW/'contact-sheet-manifest.json').write_text(json.dumps({'localOnlyOutput':str(destination.relative_to(ROOT)),
    'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),'size':list(canvas.size),
    'method':'Resizing and labelled LRX-08 crop only; no retouching or generated reference imagery',
    'assetSha256':gate['sha256'],'rows':records},indent=2)+'\n')
print(destination)
