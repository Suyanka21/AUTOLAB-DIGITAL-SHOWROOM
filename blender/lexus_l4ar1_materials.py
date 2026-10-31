"""Reference-guided fields, Blender 5.2.2. Photographs never enter this builder.

Physical parameters are visual estimates. No vertex displacement or production writes.
"""
from pathlib import Path
import json
import hashlib
import time
import sys
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parent))
from lexus_l4_materials import cell_distance, random_cell

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'blender/out/lexus-l4ar1'
SIZE=1024
ATLAS_METRES=(.8,.72)

def smooth(a,b,x):
    t=np.clip((x-a)/(b-a),0,1)
    return t*t*(3-2*t)

def surface_fields(kind,x,s,clearance):
    if kind not in ('diamond','perforated'):raise ValueError('Unknown reference treatment')
    x,s,clearance=np.broadcast_arrays(np.asarray(x,dtype=float),np.asarray(s,dtype=float),np.asarray(clearance,dtype=float))
    d1,d2,_=cell_distance(x/.16,s/.16,128)
    grain=1-np.exp(-((d2-d1)/.14)**2)
    fine=np.sin(x*7381+np.sin(s*987))*np.sin(s*8721+np.sin(x*814))
    height=.000045*grain+.000008*fine
    # Small tension ripples near seam bands; no physical hide measurement implied.
    wrinkle=.000035*np.sin(x*443+np.sin(s*119+np.sin(x*67)))*np.exp(-((clearance-.014)/.009)**2)
    height+=wrinkle
    weight=smooth(.004,.006,clearance)
    pad_weight=smooth(.004,.012,clearance)
    pitch=.0032
    cx=np.floor(x/pitch);cy=np.floor(s/pitch)
    dx=x/pitch-cx-.5-(random_cell(cx,cy)-.5)*.035
    dy=s/pitch-cy-.5-(random_cell(cx,cy,1)-.5)*.035
    # Rounded-square aperture, understated radius variation, orderly rows.
    radius=.125*(.96+.08*random_cell(cx,cy,2))
    distance=(np.abs(dx)**4+np.abs(dy)**4)**.25
    pore=np.exp(-((distance/radius)**8))*weight
    lip=np.exp(-((distance-radius*1.15)/.035)**2)*weight
    height-=.00023*pore;height+=.000035*lip
    padding=np.zeros_like(x);thread=np.zeros_like(x);groove=np.zeros_like(x)
    if kind=='diamond':
        p=x/.055+s/.082;q=x/.055-s/.082
        a=np.abs(np.mod(p+.5,1)-.5);b=np.abs(np.mod(q+.5,1)-.5)
        metric=1/np.hypot(1/.055,1/.082)
        padding=.0055*(np.sin(np.pi*p)**2*np.sin(np.pi*q)**2)**.85*pad_weight
        groove=np.exp(-((np.minimum(a,b)*metric)/.00085)**2)*weight
        # Recessed thread shares existing independently adjustable thread colour.
        dash1=smooth(-.35,.1,np.cos(2*np.pi*q*13))
        dash2=smooth(-.35,.1,np.cos(2*np.pi*p*13))
        thread=np.maximum(np.exp(-((a*metric/.00024)**4))*dash1,np.exp(-((b*metric/.00024)**4))*dash2)*weight
        height+=padding-.00040*groove+.000065*thread
    base=np.clip(.91+.035*grain+.008*fine-.68*pore-.12*groove+.015*lip,0,1)
    rough=np.clip(.92+.07*(1-grain)+.012*fine+.02*pore,0,1)
    ao=np.clip(1-.45*pore-.20*groove,0,1)
    return dict(height=height,padding=padding,thread=thread,pore=pore,grain=grain,base=base,roughness=rough,ao=ao)

def atlas_clearance(data,size):
    """Raster actual primary triangles; distance to actual outline and authored seams."""
    uv=np.asarray(data['uv']).reshape(-1,2);yy,xx=np.mgrid[:size,:size]
    u=(xx+.5)/size;v=(yy+.5)/size
    inside=np.zeros((size,size),bool);clearance=np.full((size,size),.04)
    for panel in data['panels']:
        for tri in panel['triangles']:
            pts=uv[tri]*size-.5;lo=np.maximum(np.floor(pts.min(0)).astype(int),0);hi=np.minimum(np.ceil(pts.max(0)).astype(int)+1,size)
            y,x=np.mgrid[lo[1]:hi[1],lo[0]:hi[0]];a,b,c=pts
            den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            w0=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den
            w1=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den
            inside[lo[1]:hi[1],lo[0]:hi[0]]|=(w0>=-1e-6)&(w1>=-1e-6)&(w0+w1<=1+1e-6)
        for edge in panel['boundary']:
            a,b=uv[edge]*ATLAS_METRES;pad=.025
            lo=np.maximum(np.floor((np.minimum(a,b)-pad)/ATLAS_METRES*size).astype(int),0)
            hi=np.minimum(np.ceil((np.maximum(a,b)+pad)/ATLAS_METRES*size).astype(int)+1,size)
            sl=np.s_[lo[1]:hi[1],lo[0]:hi[0]];x=u[sl]*.8;y=v[sl]*.72;d=b-a
            t=np.clip(((x-a[0])*d[0]+(y-a[1])*d[1])/np.dot(d,d),0,1)
            clearance[sl]=np.minimum(clearance[sl],np.hypot(x-a[0]-t*d[0],y-a[1]-t*d[1]))
        select=(u<.5)if panel['index']==0 else(u>=.5)
        x=(u-(panel['index']+.5)*.5)*.8;s=(.96-v)*.72
        if panel['name']=='cushion':
            for t in [.32,.66]:clearance=np.where(select,np.minimum(clearance,abs(s-np.interp(t,panel['parameter'],panel['arcMetres']))),clearance)
        else:
            t=np.interp(s,panel['arcMetres'],panel['parameter'])
            bell=lambda z,c,w:np.exp(-((z-c)/w)**2)
            width=.225+.045*np.sin(np.pi*t)**.8-.010*t+.032*bell(t,.78,.22)-.012*bell(t,.32,.20)-.010*bell(t,1,.08)
            junction=.53+.12*(1-(x/width/.58)**2)
            js=np.interp(junction,panel['parameter'],panel['arcMetres'])
            clearance=np.where(select,np.minimum(clearance,abs(s-js)/1.5),clearance)
    return np.where(inside,clearance,0),inside

def normal_from_height(height):
    dy,dx=np.gradient(height,.72/height.shape[0],.8/height.shape[1])
    normal=np.stack((-dx,-dy,np.ones_like(dx)),axis=2)
    normal/=np.linalg.norm(normal,axis=2)[:,:,None]
    return normal*.5+.5

def build():
    import bpy
    started=time.perf_counter();OUT.mkdir(parents=True,exist_ok=True)
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    data=json.loads((OUT/'atlas.json').read_text());n=SIZE*2
    clearance,inside=atlas_clearance(data,n);v,u=(np.mgrid[:n,:n]+.5)/n
    x=(u-np.where(u<.5,.25,.75))*.8;s=(.96-v)*.72
    down=lambda a:a.reshape(SIZE,2,SIZE,2).mean(axis=(1,3))
    records=[]
    for kind in ['diamond','perforated']:
        fields=surface_fields(kind,x,s,clearance)
        normal=normal_from_height(down(fields['height']))
        arrays={'base':np.stack([down(fields['base'])]*3+[np.ones((SIZE,SIZE))],axis=2),
                'normal':np.concatenate((normal,np.ones((SIZE,SIZE,1))),axis=2),
                'orm':np.stack((down(fields['ao']),down(fields['roughness']),np.zeros((SIZE,SIZE)),down(fields['thread'])),axis=2)}
        for role,pixels in arrays.items():
            name=kind+'-'+role;im=bpy.data.images.new(name,width=SIZE,height=SIZE,alpha=True)
            im.colorspace_settings.name='sRGB'if role=='base'else'Non-Color'
            im.pixels.foreach_set(pixels[::-1].astype(np.float32).ravel());im.filepath_raw=str(OUT/(name+'.png'));im.file_format='PNG';im.save()
            records.append({'file':name+'.png','sha256':hashlib.sha256((OUT/(name+'.png')).read_bytes()).hexdigest()})
        np.savez_compressed(OUT/(kind+'-fields.npz'),clearance=down(clearance),inside=down(inside.astype(float)),thread=down(fields['thread']),pore=down(fields['pore']),padding=down(fields['padding']))
    report={'blender':bpy.app.version_string,'seconds':time.perf_counter()-started,'sourceSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'images':records,'size':SIZE,'supersampling':2,'maxPaddingMetres':.0055,'porePitchMetres':.0032,'note':'Estimated visual parameters. Unique atlas; tangent-space normal relief only. Actual geometry unchanged.'}
    (OUT/'texture-build.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2),flush=True)

if __name__=='__main__':build()
