"""Layout actual photographs/renders with labels; no appearance synthesis/retouching."""
from pathlib import Path
import json
import hashlib
from PIL import Image,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[1];R=ROOT/'docs/review/lexus-l4ar1-2026-10-29';E=R/'evidence'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25);small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
browser=read(E/'browser.json');assert browser['verificationPassed']
preservation=read(E/'preservation.json');settings=None;camera_settings=None;assets=[]
def fit(canvas,im,box):
    im=im.convert('RGB');im.thumbnail((box[2]-box[0],box[3]-box[1]))
    canvas.paste(im,((box[0]+box[2]-im.width)//2,(box[1]+box[3]-im.height)//2))
crops={'diamond':{'macro':(0,0,600,650),'boundary':(360,100,820,650)},'perforated':{'macro':(0,0,1150,1000),'boundary':(850,0,1700,1000)}}
references=[]
for kind in ['diamond','perforated']:
    final=read(E/(kind+'-finalize.json'));gate=read(E/(kind+'-gate.json'));render=read(E/(kind+'-render.json'))
    digest=sha(ROOT/final['asset']);assert digest==final['sha256']==gate['sha256']==render['assetSha256'];assert gate['passed']
    assert next(b for b in browser['assets']if b['kind']==kind)['sha256']==digest
    assert next(a for a in preservation['samples']if a['kind']==kind)['sha256']==digest
    current={k:render[k]for k in ['blender','sampleLimit','tracingLimitSeconds','resolution','lights','colors']}
    if settings is None:settings=current
    assert current==settings
    by_name={v['file']:v for v in render['views']};assert len(by_name)==3
    current_cameras={name:{k:by_name[kind+'-'+name+'.png'][k]for k in ['location','target','lensMm']}for name in ['normal','macro','boundary']}
    if camera_settings is None:camera_settings=current_cameras
    assert current_cameras==camera_settings
    for record in render['views']:assert record['renderScriptSha256']==sha(ROOT/'blender/render_lexus_l4ar1.py')
    ref=R/'references'/(kind+'.jfif');photograph=Image.open(ref)
    references.append({'file':str(ref.relative_to(ROOT)),'sha256':sha(ref),'size':photograph.size,'source':'Owner supplied photograph; attribution/scale/light calibration unknown','crops':crops[kind]})
    for view in ['normal','macro','boundary']:
        path=R/(kind+'-'+view+'.png');record=by_name[path.name];assert sha(path)==record['sha256']
        sheet=Image.new('RGB',(2200,1160),'#1b2126');d=ImageDraw.Draw(sheet)
        d.text((25,18),'L4A-R1 / '+kind.upper()+' / '+view.upper()+' / OWNER REVIEW - NOT ACCEPTED',font=font,fill='white')
        d.text((25,64),'OWNER PHOTO'+(' - CLOSE-UP ONLY; NO FULL-SEAT REFERENCE'if view=='normal'else' - CROP'),font=small,fill='#e5bb83')
        d.text((1125,64),'EXPERIMENTAL RENDER / SAME FIXED RIG',font=small,fill='#e5bb83')
        crop=photograph if view=='normal'else photograph.crop(crops[kind][view])
        fit(sheet,crop,(0,105,1100,1105));fit(sheet,Image.open(path),(1100,105,2200,1105))
        d.text((25,1120),'Photo lighting and physical scale are unknown. Renders share settings; this is not calibrated colour matching.',font=small,fill='white')
        sheet.save(R/(kind+'-'+view+'-comparison.png'))
    assets.append({'kind':kind,'asset':final['asset'],'sha256':digest,'bytes':final['bytes'],'views':render['views']})
contact=Image.new('RGB',(1800,1210),'#1b2126');d=ImageDraw.Draw(contact)
d.text((20,12),'L4A-R1 / MATERIAL REFINEMENT / VISUAL ACCEPTANCE PENDING',font=font,fill='white')
for row,kind in enumerate(['diamond','perforated']):
    for col,view in enumerate(['normal','macro','boundary']):
        d.text((col*600+15,52+row*575),kind.upper()+' / '+view.upper(),font=small,fill='#e5bb83')
        fit(contact,Image.open(R/(kind+'-'+view+'.png')),(col*600,85+row*575,(col+1)*600,625+row*575))
contact.save(R/'contact-sheet.png')
sources=['blender/lexus_l4ar1_materials.py','blender/render_lexus_l4ar1.py','tools/prepare-lexus-l4ar1.mjs','scripts/finalize-lexus-l4ar1.mjs','tools/audit-lexus-l4ar1.mjs','tools/verify-lexus-l4ar1.mjs','tools/package-lexus-l4ar1-review.py','experiments/lexus-l4a/thread-mask.mjs']
report={'assets':assets,'references':references,'settings':settings,'sources':{p:sha(ROOT/p)for p in sources},'images':{p.name:sha(p)for p in R.glob('*.png')},'renderSeconds':sum(v['seconds']for a in assets for v in a['views']),
        'activeAssemblySha256':sha(ROOT/'public/assets/3d/lexus-rx350/interior-l2b.glb'),'note':'Primary UV/tangents changed in experimental copies only. Photos used for comparison, never as texture inputs. Normal-only relief and atlas microdetail remain inadequate for photographic acceptance.'}
(R/'delivery-index.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'assets':[(a['kind'],a['bytes'])for a in assets],'renderSeconds':report['renderSeconds'],'referenceHashes':[(r['file'],r['sha256'])for r in references]},indent=2))
