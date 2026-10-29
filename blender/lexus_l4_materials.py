"""L4A procedural fields. Blender 5.2.2 / NumPy; no geometry writes or photo pixels.

Tile nominally 160 mm in U; actual V scale differs by existing seat panel.
All dimensions are prototype choices, not manufacturer/workshop measurements.
"""
from pathlib import Path
import hashlib
import json
import time
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'blender/out/lexus-l4a'
SIZE=1024
TILE_METRES=.16

def random_cell(x,y,salt=0):
    return np.mod(np.sin(x*127.1+y*311.7+salt*74.7+22350)*43758.5453,1)

def cell_distance(u,v,count,stagger=False):
    x=np.mod(u,1)*count;y=np.mod(v,1)*count
    ix=np.floor(x);iy=np.floor(y)
    first=np.full_like(x,10.);second=np.full_like(x,10.);radius=np.ones_like(x)
    for oy in [-1,0,1]:
        for ox in [-1,0,1]:
            cx=ix+ox;cy=iy+oy;wx=np.mod(cx,count);wy=np.mod(cy,count)
            jitter=.13 if stagger else .7
            dx=x-(cx+.5+(random_cell(wx,wy)-.5)*jitter+(np.mod(cy,2)*.5 if stagger else 0))
            dy=y-(cy+.5+(random_cell(wx,wy,1)-.5)*jitter)
            dist=np.sqrt(dx*dx+dy*dy)
            new=dist<first
            radius=np.where(new,.9+.2*random_cell(wx,wy,2),radius)
            second=np.minimum(second,np.maximum(first,dist));first=np.minimum(first,dist)
    return first,second,radius

def material_fields(kind,u,v):
    if kind not in ['classic','diamond','perforated']:raise ValueError('Unknown prototype treatment')
    u=np.asarray(u,dtype=np.float64);v=np.asarray(v,dtype=np.float64)
    d1,d2,_=cell_distance(u,v,96)
    grain=1-np.exp(-((d2-d1)/.09)**2)
    micro=np.sin(2*np.pi*(173*u+13*v))*np.sin(2*np.pi*(19*u-157*v))
    height=.000018*grain+.000002*micro
    base=.90+.035*grain+.006*micro
    rough=.90+.055*(1-grain)+.012*micro
    ao=np.ones_like(u);thread=np.zeros_like(u)
    if kind=='perforated':
        d,_,radius=cell_distance(u,v,64,True)
        pore=np.exp(-((d/(.13*radius))**4))
        height-=.00018*pore;base-=.60*pore;ao-=.3*pore
        rough+=.035*pore
    if kind=='diamond':
        p=(u+v)*4;q=(u-v)*4
        a=np.abs(np.mod(p+.5,1)-.5);b=np.abs(np.mod(q+.5,1)-.5)
        distance=np.minimum(a,b)*TILE_METRES/(4*np.sqrt(2))
        padding=(np.sin(np.pi*p)**2*np.sin(np.pi*q)**2)**.55
        groove=np.exp(-(distance/.00065)**2)
        height+=.0012*padding-.00012*groove
        base-=.18*groove;ao-=.16*groove;rough+=.025*groove
        # Two diagonal families, dashed at about 2 mm prototype pitch.
        dash_a=np.clip((np.cos(2*np.pi*q*14)-.05)*8,0,1)
        dash_b=np.clip((np.cos(2*np.pi*p*14)-.05)*8,0,1)
        thread=np.maximum(np.exp(-((a*TILE_METRES/(4*np.sqrt(2))/.00020)**4))*dash_a,
                          np.exp(-((b*TILE_METRES/(4*np.sqrt(2))/.00020)**4))*dash_b)
        height+=.00009*thread
    return {'height':height,'base':np.clip(base,0,1),'roughness':np.clip(rough,0,1),'ao':ao,'thread':thread}

def height_normal(height,tile_metres):
    dx=(np.roll(height,-1,1)-np.roll(height,1,1))/(2*tile_metres/height.shape[1])
    dy=(np.roll(height,-1,0)-np.roll(height,1,0))/(2*tile_metres/height.shape[0])
    n=np.stack((-dx,-dy,np.ones_like(dx)),axis=2)
    n/=np.linalg.norm(n,axis=2)[:,:,None]
    return n*.5+.5

def build():
    import bpy
    start=time.perf_counter();OUT.mkdir(parents=True,exist_ok=True)
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    v,u=np.mgrid[0:SIZE,0:SIZE]/SIZE
    records=[]
    for kind in ['classic','diamond','perforated']:
        fields=material_fields(kind,u,v)
        normal=height_normal(fields['height'],TILE_METRES)
        data={'base':np.stack([fields['base']]*3+[np.ones_like(u)],axis=2),
              'normal':np.concatenate((normal,np.ones((SIZE,SIZE,1))),axis=2),
              'orm':np.stack((fields['ao'],fields['roughness'],np.zeros_like(u),fields['thread']),axis=2)}
        for role,rgba in data.items():
            name=kind+'-'+role;im=bpy.data.images.new(name,width=SIZE,height=SIZE,alpha=True)
            im.colorspace_settings.name='sRGB' if role=='base' else 'Non-Color'
            # Non-color numeric data; neutral sRGB base remains recolourable.
            # PNG/glTF row zero is UV v=0 at the top; Blender's pixel buffer starts
            # at the bottom. Flip storage rows, keeping the normal +Y gradient
            # aligned with the saved height/mask pattern (regression-tested).
            im.pixels.foreach_set(rgba[::-1].astype(np.float32).ravel())
            im.filepath_raw=str(OUT/(name+'.png'));im.file_format='PNG';im.save()
            records.append({'file':name+'.png','sha256':hashlib.sha256((OUT/(name+'.png')).read_bytes()).hexdigest()})
    report={'blender':bpy.app.version_string,'size':SIZE,'nominalTileMetres':TILE_METRES,'seed':22350,
            'seconds':time.perf_counter()-start,'sourceSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'images':records,
            'note':'Procedural prototype maps only. No seat/UV/geometry changes. Padding height is normal-map relief, no displaced silhouette.'}
    (OUT/'texture-build.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
    print(json.dumps(report,indent=2),flush=True)

if __name__=='__main__':build()
