"""Package actual L4A renders and evidence; never generates model appearance."""
from pathlib import Path
import hashlib
import json
import struct
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1];R=ROOT/'docs/review/lexus-l4a-2026-10-29';E=R/'evidence'
read=lambda p:json.loads(p.read_text(encoding='utf8'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
browser=read(E/'browser.json');assert browser['verificationPassed']
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',24);small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
def tile(canvas,path,box):
    with Image.open(path) as source:
        im=source.convert('RGB');im.thumbnail((box[2]-box[0],box[3]-box[1]))
        canvas.paste(im,((box[0]+box[2]-im.width)//2,(box[1]+box[3]-im.height)//2))
records=[];settings=None;seconds=0
for kind in ['classic','diamond','perforated']:
    final=read(E/(kind+'-finalize.json'));gate=read(E/(kind+'-gate.json'));render=read(E/(kind+'-render.json'));b=next(a for a in browser['assets']if a['kind']==kind)
    digest=sha(ROOT/final['asset']);assert digest==final['sha256']==gate['sha256']==render['assetSha256']==b['sha256'];assert gate['passed']
    keys=['blender','renderer','sampleLimit','tracingLimitSeconds','resolution','lights','colors']
    current={k:render[k]for k in keys}
    if settings is None:settings=current
    assert settings==current
    for v in render['views']:
        assert sha(R/v['file'])==v['sha256'];seconds+=v['seconds']
    records.append({'kind':kind,'sha256':digest,'bytes':final['bytes'],'triangles':gate['triangleCount'],'calls':gate['drawCalls'],
                    'loadMs':b['loadMs'],'renderer':b['renderer'],'views':render['views']})
    sheet=Image.new('RGB',(2200,1090),'#192127');d=ImageDraw.Draw(sheet)
    d.text((25,15),'L4A '+kind+' | prototype only | same lighting | owner approval pending',font=font,fill='white')
    d.text((25,55),'NORMAL SHOWROOM DISTANCE',font=small,fill='#d3bf94');d.text((1125,55),'MACRO / EXISTING SEAMS PRESERVED',font=small,fill='#d3bf94')
    for col,name in enumerate(['normal','macro']):tile(sheet,R/(kind+'-'+name+'.png'),(col*1100,85,(col+1)*1100,1085))
    sheet.save(R/(kind+'-comparison.png'))
for view in ['normal','macro']:
    sheet=Image.new('RGB',(2100,760),'#192127');d=ImageDraw.Draw(sheet)
    for col,kind in enumerate(['classic','diamond','perforated']):
        d.text((col*700+20,15),kind.upper()+' / '+view,font=font,fill='white');tile(sheet,R/(kind+'-'+view+'.png'),(col*700,55,(col+1)*700,750))
    sheet.save(R/(view+'-comparison.png'))
sheet=Image.new('RGB',(1800,1210),'#192127');d=ImageDraw.Draw(sheet)
d.text((20,12),'L4 STAGE A | MATERIAL PROTOTYPES | OWNER REVIEW PENDING',font=font,fill='white')
for col,kind in enumerate(['classic','diamond','perforated']):
    d.text((col*600+20,52),kind.upper(),font=font,fill='#d3bf94')
    for row,view in enumerate(['normal','macro']):tile(sheet,R/(kind+'-'+view+'.png'),(col*600,95+row*550,(col+1)*600,635+row*550))
sheet.save(R/'contact-sheet.png')
# Plot delivered UVs using their full bounds; no texture-atlas assumption.
wire=read(ROOT/'blender/out/lexus-l4a/uv-wire.json');atlas=Image.new('RGB',(1400,1000),'#182027');d=ImageDraw.Draw(atlas)
for col,side in enumerate(['Driver','Passenger']):
    x=col*700;d.text((x+18,18),side+' actual UV0: insert overlap',font=font,fill='white')
    for item in wire:
        if not item['node'].endswith(side):continue
        points=[(x+350+u*200,120+(.94-v)*210)for u,v in item['t']]
        d.line(points+[points[0]],fill='#eaad62'if item['zone']=='cushion-insert'else'#56b5d4',width=1)
    d.text((x+20,930),'Orange cushion / blue backrest; repeated UV units',font=small,fill='white')
    d.text((x+20,960),'Intentional overlap; not a unique bake atlas',font=small,fill='white')
atlas.save(R/'uv-layout.png')
# Conservative integration estimate only; never writes a combined GLB.
active=(ROOT/'public/assets/3d/lexus-rx350/interior-l2b.glb').read_bytes();length=struct.unpack_from('<I',active,12)[0];g=json.loads(active[20:20+length]);seat=set();cockpit=set()
for m in g['materials']:
    dest=seat if m['name'].startswith('MAT_Seat_')else cockpit;p=m.get('pbrMetallicRoughness',{})
    for t in [p.get('baseColorTexture'),p.get('metallicRoughnessTexture'),m.get('normalTexture'),m.get('occlusionTexture')]:
        if t:dest.add(g['textures'][t['index']]['extensions']['KHR_texture_basisu']['source'])
removed=sum(g['bufferViews'][g['images'][i]['bufferView']]['byteLength']for i in seat-cockpit)
textures=read(E/'finalize.json')['textures'];estimates=[]
for kind in ['classic','diamond','perforated']:
    needed={kind,'classic'};added=sum(t['bytes']for t in textures if any(t['name'].startswith(k+'-')for k in needed));count=len(needed)*3+len(cockpit)
    estimates.append({'treatment':kind,'activeAssetBytes':len(active),'removedSeatOnlyTextureBytes':removed,
      'retainedSharedCockpitImages':[g['images'][i]['name']for i in seat&cockpit],'newTextureBytes':added,
      'estimatedCombinedTransferBytes':len(active)-removed+added,'estimatedResidentTextures':count,
      'estimated8bppBlockCompressedMipBytes':count*1398102,'estimatedRgba8MipBytes':count*5592404,
      'note':'Estimate, not measured GPU memory or a complete-scene gate. Deduplicated maps; original cockpit normal retained; JSON overhead not recalculated. Load one treatment at a time.'})
(E/'performance-estimate.json').write_text(json.dumps(estimates,indent=2)+'\n',encoding='utf8')
sources=['blender/lexus_l4_materials.py','blender/render_lexus_l4a.py','scripts/finalize-lexus-l4a.mjs','scripts/lib/lexus-material-images.mjs','experiments/lexus-l4a/thread-mask.mjs','tools/inspect-lexus-l4-uv.mjs','tools/verify-lexus-l4a.mjs','tools/package-lexus-l4a-review.py']
index={'assets':records,'settings':settings,'renderSeconds':seconds,'sources':{p:sha(ROOT/p)for p in sources},
       'images':{p.name:sha(p)for p in R.glob('*.png')},'activeAssemblySha256':hashlib.sha256(active).hexdigest(),
       'note':'Technical feasibility only. No physical hide sample, phone/GPU measurements, visual approval or Stage B integration.'}
(R/'delivery-index.json').write_text(json.dumps(index,indent=2)+'\n',encoding='utf8');print(json.dumps(index,indent=2))
