"""Compose L2B-R1 evidence from hash-matched real renders; dealer photos stay local."""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'blender/out/lexus-l2b-r1'
REVIEW=ROOT/'docs/review/lexus-l2b-r1-2026-10-27'
BASE=ROOT/'docs/review/lexus-l2b-2026-10-26'
EVIDENCE=REVIEW/'evidence'
EVIDENCE.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text(encoding='utf8'))
records=[];views=[];comparisons=[]
for stage,name,gate_name in [('dashboard','dashboard-l2b','lexus-dashboard'),('wheel','wheel-l2b','lexus-wheel'),('combined','interior-l2b','lexus')]:
    asset=ROOT/'public/assets/3d/lexus-rx350'/(name+'.glb')
    gate=read(ROOT/'reports'/(gate_name+'-report.json'))
    browser=read(OUT/'browser'/stage/'browser-report.json')
    render=read(OUT/'review'/stage/'render-report.json')
    final=read(OUT/(name+'-finalize.json'))
    baseline_render=read(BASE/'evidence'/(stage+'-render-report.json'))
    assert gate['passed'] and not gate['synthetic'] and browser['verificationPassed']
    assert sha(asset)==gate['sha256']==browser['assetSha256']==render['assetSha256']==final['sha256']
    assert sha(OUT/(name+'-render.glb'))==render['proxySha256']==final['proxySha256']
    for key in ['renderer','blender','sampleLimit','tracingTimeLimitSeconds','resolution','lights','lightTarget']:
        assert render[key]==baseline_render[key],(stage,key)
    for view in render['views']:
        baseline_view=next(v for v in baseline_render['views'] if v['file']==view['file'])
        for key in ['location','target','lensMm']:assert view[key]==baseline_view[key],(stage,key)
        source=OUT/'review'/stage/view['file'];assert sha(source)==view['sha256']
        assert sha(BASE/view['file'])==baseline_view['sha256']
        shutil.copy2(source,REVIEW/view['file']);views.append(REVIEW/view['file'])
    for kind,path in [('gate',ROOT/'reports'/(gate_name+'-report.json')),('browser',OUT/'browser'/stage/'browser-report.json'),
                      ('render',OUT/'review'/stage/'render-report.json'),('finalize',OUT/(name+'-finalize.json'))]:
        shutil.copy2(path,EVIDENCE/(stage+'-'+kind+'-report.json'))
    if stage!='combined':shutil.copy2(OUT/(stage+'-build.json'),EVIDENCE/(stage+'-build-report.json'))
    for p in (OUT/'browser'/stage).glob('*.png'):shutil.copy2(p,EVIDENCE/(stage+'-'+p.name))
    records.append({'stage':stage,'asset':asset.relative_to(ROOT).as_posix(),'sha256':sha(asset),'bytes':asset.stat().st_size,
                    'triangles':gate['triangleCount'],'drawCalls':gate['drawCalls'],'ktxTextureCount':len(gate['textures']),
                    'textureBytesEstimated':gate['gpuTextureBytesEstimated'],'gateExitCode':0,'browser':browser['browser'],
                    'loadMs':browser['loadMs'],'renderer':browser['renderer'],'renderSeconds':sum(v['seconds']for v in render['views'])})

font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',26)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
def tile(canvas,path,rect):
    image=Image.open(path).convert('RGB');image.thumbnail((rect[2]-rect[0],rect[3]-rect[1]))
    canvas.paste(image,((rect[0]+rect[2]-image.width)//2,(rect[1]+rect[3]-image.height)//2))

for stage,filename in [('dashboard','04-dashboard.png'),('wheel','03-wheel.png'),('combined','06-cockpit-overview.png')]:
    canvas=Image.new('RGB',(2400,1120),'#171b20');draw=ImageDraw.Draw(canvas)
    draw.text((24,18),f'LEXUS L2B-R1 | {stage} | Same camera, lighting and render settings',font=font,fill='white')
    draw.text((24,65),'BEFORE — L2B / dfa77e2',font=small,fill='#cbd5df')
    draw.text((1224,65),'AFTER — L2B-R1 / human acceptance pending',font=small,fill='#cbd5df')
    tile(canvas,BASE/filename,(0,105,1200,1105));tile(canvas,REVIEW/filename,(1200,105,2400,1105))
    output=REVIEW/(stage+'-before-after.png');canvas.save(output)
    comparisons.append({'stage':stage,'file':output.name,'sha256':sha(output),'before':filename,'beforeSha256':sha(BASE/filename),'afterSha256':sha(REVIEW/filename)})

sheet=Image.new('RGB',(1600,1510),'#171b20');draw=ImageDraw.Draw(sheet)
draw.text((24,20),'LEXUS L2B-R1 | Actual asset renders | Owner review pending',font=font,fill='white')
for i,p in enumerate(views):
    x=(i%2)*800;y=75+(i//2)*690
    draw.text((x+18,y),p.stem,font=font,fill='white');tile(sheet,p,(x+8,y+45,x+792,y+675))
draw.text((24,1475),'Seats preserved | Provisional dimensions | No L3 integration or measured phone performance',font=small,fill='#cbd5df')
sheet.save(REVIEW/'contact-sheet.png')

pack=ROOT/'AUTOLAB_LEXUS_SEAT_REFERENCE_PACK'
refs=[('05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_35.jpg','04-dashboard.png','Dashboard / display / vents'),
      ('01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_33.jpg','03-wheel.png','Non-F-SPORT wheel / controls'),
      ('01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_29.jpg','06-cockpit-overview.png','Bounded cockpit placement — perspective differs')]
sheet=Image.new('RGB',(1800,2400),'#171b20');draw=ImageDraw.Draw(sheet);reference_records=[]
for i,(reference,render,label)in enumerate(refs):
    y=i*800;draw.text((25,y+18),label,font=font,fill='white')
    draw.text((25,y+60),'DEALER REFERENCE — local research only',font=small,fill='#cbd5df')
    draw.text((925,y+60),'DELIVERED ASSET — uncalibrated comparison',font=small,fill='#cbd5df')
    tile(sheet,pack/reference,(10,y+100,890,y+780));tile(sheet,REVIEW/render,(910,y+100,1790,y+780))
    reference_records.append({'file':reference,'sha256':sha(pack/reference),'render':render})
local=pack/'L2B_R1_REVIEW';local.mkdir(exist_ok=True);sheet.save(local/'reference-contact-sheet.png')
sources=['blender/build_lexus_l2b.py','blender/lexus_l2b_cockpit.py','blender/cockpit_surfaces.py','blender/lexus_l2b_constants.py',
         'blender/render_lexus_l2b.py','scripts/finalize-lexus-l2b.mjs','tools/verify-lexus-l2a.mjs','tools/package-lexus-l2b-r1-review.py']
index={'assets':records,'sourceHashes':{p:sha(ROOT/p)for p in sources},'renderHashes':{p.name:sha(p)for p in views},
       'comparisonSheets':comparisons,'contactSheetSha256':sha(REVIEW/'contact-sheet.png'),
       'localReferenceSheetSha256':sha(local/'reference-contact-sheet.png'),'references':reference_records,
       'note':'Matched original L2B comparison cameras/lighting; no visual scores. GPU texture bytes are estimates, loader timing is local SwiftShader.'}
(REVIEW/'delivery-index.json').write_text(json.dumps(index,indent=2)+'\n',encoding='utf8')
print(json.dumps(index,indent=2))
