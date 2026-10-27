"""Hash-linked L2B review renders using delivered geometry and decoded KTX pixels."""
import bpy
import hashlib
import json
import math
import sys
import time
from pathlib import Path
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
import lexus_l2b_constants as C

stage=sys.argv[sys.argv.index('--')+1]
name={'passenger':'passenger-seat-l2b','wheel':'wheel-l2b','dashboard':'dashboard-l2b','combined':'interior-l2b'}[stage]
out=C.OUT/'review'/stage;out.mkdir(parents=True,exist_ok=True)
record=json.loads((C.OUT/(name+'-finalize.json')).read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(C.ROOT/record['asset'])==record['sha256']
assert sha(C.OUT/(name+'-render.glb'))==record['proxySha256']
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(C.OUT/(name+'-render.glb')))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU'
scene.cycles.samples=32;scene.cycles.seed=22350;scene.cycles.use_denoising=True;scene.cycles.time_limit=90
scene.render.threads_mode='FIXED';scene.render.threads=6
scene.render.resolution_x=1200;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.16,.17,.18,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.35
def aim(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
lights=[('Key',(-1.6,-1.8,2.5),150,1.6),('Fill',(1,-.6,1.7),70,1.5),('Rim',(-.6,1.3,2.3),150,1.2)]
for n,p,w,s in lights:
    d=bpy.data.lights.new(n,'AREA');d.energy=w;d.shape='DISK';d.size=s
    o=bpy.data.objects.new(n,d);scene.collection.objects.link(o);o.location=p;aim(o,(0,-.25,.85))
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,.295))
floor=bpy.context.object;floor.name='Review-only ground'
m=bpy.data.materials.new('Review-only neutral');m.use_nodes=True
m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.10,.11,.12,1)
m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.9;floor.data.materials.append(m)
d=bpy.data.cameras.new('Review camera');camera=bpy.data.objects.new('Review camera',d)
scene.collection.objects.link(camera);scene.camera=camera
# Dedicated evidence views, never written into the application camera configuration.
views={
 'passenger':[('01-passenger', (1.65,-1.95,1.55),(.38,.05,.86),55),
              ('02-passenger-seam',( .93,-.72,.95),(.57,-.12,.51),65)],
 'wheel':[('03-wheel',(-.76,.35,1.19),(-.38,-.43,.90),60)],
 'dashboard':[('04-dashboard',(1.00,.75,1.47),(0,-.71,.94),52)],
 'combined':[('05-combined',(-2.15,-1.70,1.85),(0,-.15,.83),48),
             ('06-cockpit-overview',(-1.50,.65,1.60),(0,-.46,.85),46)]
}[stage]
report={'asset':record['asset'],'assetSha256':record['sha256'],'proxySha256':record['proxySha256'],
 'renderer':'Cycles CPU','blender':bpy.app.version_string,'sampleLimit':32,'achievedSamples':None,'tracingTimeLimitSeconds':90,
 'resolution':[1200,1000],'lights':lights,'lightTarget':[0,-.25,.85],
 'note':'Delivered Draco geometry and decoded delivered KTX level-0 pixels; ground and lights are presentation-only. No human scores or GPU measurements.',
 'views':[]}
for n,p,t,lens in views:
    camera.location=p;d.lens=lens;aim(camera,t);scene.render.filepath=str(out/(n+'.png'));start=time.perf_counter()
    bpy.ops.render.render(write_still=True)
    report['views'].append({'file':n+'.png','location':p,'target':t,'lensMm':lens,'seconds':time.perf_counter()-start,'sha256':sha(out/(n+'.png'))})
    (out/'render-report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print('L2B_RENDER '+json.dumps(report['views'][-1]),flush=True)
