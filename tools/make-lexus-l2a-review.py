"""Compose existing render/photo pixels; never generate or retouch geometric evidence.

The photo comparison stays in the ignored, local-only reference pack.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'docs/review/lexus-l2a-r1-2026-10-24'
BASELINE=ROOT/'docs/review/lexus-l2a-2026-10-23'
PACK=ROOT/'AUTOLAB_LEXUS_SEAT_REFERENCE_PACK'
OUT=PACK/'L2A_R1_REVIEW'
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
draw.text((40,25),'Lexus RX 350 / L2A-R1 owner visual review',font=title,fill='#18242c')
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

# Compare unchanged historical pixels with the new renders under the same rig.
before_report=json.loads((BASELINE/'render-report.json').read_text())
baseline_gate=json.loads((REVIEW/'evidence/baseline-gate.json').read_text())
assert before_report['assetSha256']==baseline_gate['sha256']
assert before_report['lights']==render_report['lights']
for field in ('resolution','sampleLimit','tracingTimeLimitSeconds','renderer','blender'):
    assert before_report[field]==render_report[field], 'Comparison settings differ: '+field
comparison=Image.new('RGB',(2080,3030),'#eef0f2')
draw=ImageDraw.Draw(comparison)
draw.text((40,25),'Lexus RX 350 / L2A before and L2A-R1 after',font=title,fill='#18242c')
draw.text((40,80),'Same cameras, lights and resolution. Both candidates await owner visual acceptance.',font=font,fill='#18242c')
before_hashes={v['file']:v for v in before_report['views']}
after_hashes={v['file']:v for v in render_report['views']}
for index,(render,label,*_) in enumerate(rows):
    old=before_hashes[render];new=after_hashes[render]
    assert all(old[key]==new[key] for key in ('location','target','lensMm'))
    assert hashlib.sha256((BASELINE/render).read_bytes()).hexdigest()==old['sha256']
    y=180+index*920
    for x,folder,caption in [(40,BASELINE,'BEFORE / L2A'),(1060,REVIEW,'AFTER / L2A-R1')]:
        draw.text((x,y),caption+' / '+label,font=font,fill='#18242c')
        with Image.open(folder/render) as source:
            panel=ImageOps.contain(source.convert('RGB'),(980,840),Image.Resampling.LANCZOS)
            comparison.paste(panel,(x+(980-panel.width)//2,y+45+(840-panel.height)//2))
draw.text((40,2950),'Baseline: '+before_report['assetSha256'],font=small,fill='#39434b')
draw.text((40,2985),'Revised:  '+render_report['assetSha256'],font=small,fill='#39434b')
comparison_path=REVIEW/'before-after.png'
comparison.save(comparison_path)
(REVIEW/'before-after-manifest.json').write_text(json.dumps({
    'baselineAssetSha256':before_report['assetSha256'],'assetSha256':render_report['assetSha256'],
    'sha256':hashlib.sha256(comparison_path.read_bytes()).hexdigest(),
    'cameraAndLightEqualityChecked':True,'method':'Unretouched historical and revised renders, resized and labelled',
    'beforeRenderReport':str((BASELINE/'render-report.json').relative_to(ROOT)),
    'afterRenderReport':str((REVIEW/'render-report.json').relative_to(ROOT))},indent=2)+'\n')
print(comparison_path)
