"""Package actual, hash-matched L2B renders/reports; photographs remain local-only."""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'blender/out/lexus-l2b'
REVIEW=ROOT/'docs/review/lexus-l2b-2026-10-26'
EVIDENCE=REVIEW/'evidence'
EVIDENCE.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
records=[]; renders=[]
for stage,asset,gate_name in [('passenger','passenger-seat-l2b','lexus-passenger-report'),('wheel','wheel-l2b','lexus-wheel-report'),('dashboard','dashboard-l2b','lexus-dashboard-report'),('combined','interior-l2b','lexus-report')]:
    file=ROOT/'public/assets/3d/lexus-rx350'/(asset+'.glb')
    gate=json.loads((ROOT/'reports'/(gate_name+'.json')).read_text())
    finalize=json.loads((OUT/(asset+'-finalize.json')).read_text())
    render=json.loads((OUT/'review'/stage/'render-report.json').read_text())
    browser=json.loads((OUT/'browser'/stage/'browser-report.json').read_text())
    assert gate['passed'] and not gate['synthetic'] and browser['verificationPassed']
    assert gate['sha256']==finalize['sha256']==render['assetSha256']==browser['assetSha256']==sha(file)
    assert finalize['proxySha256']==render['proxySha256']==sha(OUT/(asset+'-render.glb'))
    for view in render['views']:
        source=OUT/'review'/stage/view['file'];assert sha(source)==view['sha256']
        shutil.copy2(source,REVIEW/view['file']);renders.append((stage,REVIEW/view['file']))
    shutil.copy2(OUT/'review'/stage/'render-report.json',EVIDENCE/(stage+'-render-report.json'))
    shutil.copy2(OUT/(asset+'-finalize.json'),EVIDENCE/(stage+'-finalize-report.json'))
    if stage!='combined':shutil.copy2(OUT/(stage+'-build.json'),EVIDENCE/(stage+'-build-report.json'))
    for source in (OUT/'browser'/stage).glob('*.png'):shutil.copy2(source,EVIDENCE/(stage+'-'+source.name))
    shutil.copy2(OUT/'browser'/stage/'browser-report.json',EVIDENCE/(stage+'-browser-report.json'))
    records.append({'stage':stage,'asset':str(file.relative_to(ROOT)),'sha256':sha(file),
        'triangles':gate['triangleCount'],'drawCalls':gate['drawCalls'],'fileSizeBytes':file.stat().st_size,
        'textureCount':len(gate['textures']),'gpuTextureBytesEstimated':gate['gpuTextureBytesEstimated'],
        'gateExitCode':0,'browserVerificationPassed':browser['verificationPassed'],'browserRenderer':browser['renderer'],
        'browserLoadMs':browser['loadMs'],'renderSeconds':sum(v['seconds'] for v in render['views'])})

font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',24)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
def tile(canvas,path,box):
    image=Image.open(path).convert('RGB');image.thumbnail((box[2]-box[0],box[3]-box[1]))
    canvas.paste(image,((box[0]+box[2]-image.width)//2,(box[1]+box[3]-image.height)//2))

# Public/repository sheet uses only our renders. No reference photographs included.
sheet=Image.new('RGB',(1600,2160),'#171b20');draw=ImageDraw.Draw(sheet)
draw.text((30,24),'LEXUS L2B | Technical evidence — visual acceptance pending',font=font,fill='white')
for i,(stage,path) in enumerate(renders):
    x=(i%2)*800;y=80+(i//2)*680
    draw.text((x+20,y+12),path.stem,font=font,fill='white')
    tile(sheet,path,(x+10,y+54,x+790,y+650))
draw.text((30,2120),'Provisional geometry | No physical-phone performance measurement | L3 excluded',font=small,fill='#b9c3cf')
sheet.save(REVIEW/'contact-sheet.png')

# Approved photographs are placed side by side only in the ignored local pack.
pack=ROOT/'AUTOLAB_LEXUS_SEAT_REFERENCE_PACK'
refs=[('01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_29.jpg','01-passenger.png','Passenger silhouette / outward controls'),
      ('01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_33.jpg','03-wheel.png','Wheel proportions / simplified spoke controls'),
      ('05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_35.jpg','04-dashboard.png','Raised screen / clock / upper dashboard only')]
comparison=Image.new('RGB',(1600,2100),'#171b20');draw=ImageDraw.Draw(comparison)
reference_records=[]
for i,(ref,render,label)in enumerate(refs):
    y=i*700;draw.text((25,y+20),label+' — uncalibrated perspective comparison',font=font,fill='white')
    draw.text((25,y+62),'Owner-supplied dealer reference (local research only)',font=small,fill='#b9c3cf')
    draw.text((825,y+62),'Actual delivered-asset render; not visual acceptance',font=small,fill='#b9c3cf')
    tile(comparison,pack/ref,(10,y+100,790,y+675));tile(comparison,REVIEW/render,(810,y+100,1590,y+675))
    reference_records.append({'reference':ref,'sha256':sha(pack/ref),'render':render,'renderSha256':sha(REVIEW/render)})
local=pack/'L2B_REVIEW';local.mkdir(exist_ok=True)
comparison.save(local/'reference-contact-sheet.png')
sources=['tools/build-lexus-asset.py','blender/build_lexus_l2b.py','blender/lexus_l2b_constants.py','blender/render_lexus_l2b.py',
         'scripts/finalize-lexus-l2b.mjs','scripts/lib/merge-glbs.mjs','scripts/validate-glb.mjs','tools/verify-lexus-l2a.mjs','tools/package-lexus-l2b-review.py']
index={'assets':records,'sourceHashes':{p:sha(ROOT/p)for p in sources},'renderHashes':{p.name:sha(p)for _,p in renders},
       'contactSheetSha256':sha(REVIEW/'contact-sheet.png'),'localReferenceSheetSha256':sha(local/'reference-contact-sheet.png'),
       'referenceComparisons':reference_records,'note':'All gate/browser/render hashes match delivered GLBs. GPU bytes are estimates; real-phone FPS not measured.'}
(REVIEW/'delivery-index.json').write_text(json.dumps(index,indent=2)+'\n',encoding='utf8')
print(json.dumps(index,indent=2))
