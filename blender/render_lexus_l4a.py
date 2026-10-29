"""L4A delivered material samples. Blender 5.2.2; no authoring or production writes."""
import bpy
import json
import hashlib
import sys
import time
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'blender/out/lexus-l4a'
REVIEW=ROOT/'docs/review/lexus-l4a-2026-10-29'
args=sys.argv[sys.argv.index('--')+1:];kind=args[0]
assert kind in ['classic','diamond','perforated']
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
final=json.loads((REVIEW/'evidence'/f'{kind}-finalize.json').read_text(encoding='utf8'))
assert sha(ROOT/final['asset'])==final['sha256']
proxy=OUT/(kind+'-render.glb');assert sha(proxy)==final['proxySha256']
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(proxy))
assert set(o.name for o in bpy.context.scene.objects)=={'GEO_Seat_Front_Driver','GEO_Seat_Stitching_Front'}
def linear(hex_value):
    a=[int(hex_value[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in a)+(1,)
colors={'MAT_Seat_Primary':'513b2e','MAT_Seat_Secondary':'292b2d','MAT_Seat_Stitching':'d3bf94'}
for name,hex_value in colors.items():
    mat=bpy.data.materials[name];nodes=mat.node_tree.nodes;links=mat.node_tree.links
    bsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');socket=bsdf.inputs['Base Color']
    if socket.is_linked:
        old=socket.links[0].from_socket;links.remove(socket.links[0])
        # Replace imported factor multiplier, retaining decoded base texture pixels.
        image=next(n for n in nodes if n.type=='TEX_IMAGE' and '-base' in n.image.name)
        multiply=nodes.new('ShaderNodeMixRGB');multiply.blend_type='MULTIPLY';multiply.inputs[0].default_value=1
        links.new(image.outputs['Color'],multiply.inputs[1]);multiply.inputs[2].default_value=linear(hex_value)
        links.new(multiply.outputs[0],socket)
        if name=='MAT_Seat_Primary' and kind=='diamond':
            orm=next(n for n in nodes if n.type=='TEX_IMAGE' and '-orm' in n.image.name)
            mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX';links.new(orm.outputs['Alpha'],mix.inputs[0]);links.new(multiply.outputs[0],mix.inputs[1])
            mix.inputs[2].default_value=tuple(v*.85 for v in linear(colors['MAT_Seat_Stitching'])[:3])+(1,)
            links.new(mix.outputs[0],socket)
    else:socket.default_value=linear(hex_value)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32;scene.cycles.seed=22350
scene.cycles.use_denoising=True;scene.cycles.time_limit=75
scene.render.threads_mode='FIXED';scene.render.threads=6
scene.render.resolution_x=1100;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.16,.17,.18,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.35
def aim(obj,p):obj.rotation_euler=(Vector(p)-obj.location).to_track_quat('-Z','Y').to_euler()
lights=[('Key',(-1.6,-1.8,2.5),150,1.6),('Fill',(1,-.6,1.7),70,1.5),('Rim',(-.6,1.3,2.3),150,1.2)]
for name,loc,power,size in lights:
    light=bpy.data.lights.new(name,'AREA');light.energy=power;light.shape='DISK';light.size=size
    obj=bpy.data.objects.new(name,light);scene.collection.objects.link(obj);obj.location=loc;aim(obj,(-.38,.04,.85))
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,.295));floor=bpy.context.object
mat=bpy.data.materials.new('Review ground');mat.use_nodes=True;mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.10,.11,.12,1);mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.9;floor.data.materials.append(mat)
data=bpy.data.cameras.new('Review camera');camera=bpy.data.objects.new('Review camera',data);scene.collection.objects.link(camera);scene.camera=camera
views=[('normal',(-1.5,-1.9,1.5),(-.38,.05,.84),55),('macro',(-.71,-.65,.85),(-.39,-.06,.51),70)]
report={'kind':kind,'assetSha256':final['sha256'],'proxySha256':final['proxySha256'],'blender':bpy.app.version_string,
        'sourceSha256':sha(Path(__file__)),'renderer':'Cycles CPU','sampleLimit':32,'tracingLimitSeconds':75,'achievedSamples':None,
        'resolution':[1100,1000],'lights':lights,'colors':colors,'views':[],
        'note':'Delivered KTX pixels, unchanged geometry/UV. Diamond ORM-alpha colour mix matches isolated WebGL hook. Display-only colours are not catalogue changes.'}
for name,loc,target,lens in views:
    camera.location=loc;data.lens=lens;aim(camera,target)
    path=REVIEW/(kind+'-'+name+'.png');scene.render.filepath=str(path);start=time.perf_counter()
    bpy.ops.render.render(write_still=True)
    item={'file':path.name,'seconds':time.perf_counter()-start,'sha256':sha(path),'location':loc,'target':target,'lensMm':lens};report['views'].append(item)
    (REVIEW/'evidence'/(kind+'-render.json')).write_text(json.dumps(report,indent=2)+'\n',encoding='utf8');print('L4_RENDER '+json.dumps(item),flush=True)
