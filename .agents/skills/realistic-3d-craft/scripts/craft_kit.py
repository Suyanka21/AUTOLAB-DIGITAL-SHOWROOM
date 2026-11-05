"""craft_kit.py: realism helpers for Blender (tested headless on Blender 5.0.1 via the bpy module).

Everything here is deterministic. Names and units: metres, Z-up. Blender input names change between
versions, so `set_input` tries aliases. ALWAYS verify against the installed version (see SKILL.md).
"""
import math
import random
import bpy
import bmesh
from mathutils import Vector

# ----------------------------------------------------------------------------- scene
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def set_render(scene, w=1280, h=720, samples=64, denoise=True, view="AgX", exposure=0.0, device="CPU"):
    scene.render.engine = "CYCLES"
    scene.cycles.device = device
    scene.cycles.samples = samples
    scene.cycles.use_denoising = denoise
    if denoise:
        scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.render.resolution_x, scene.render.resolution_y = w, h
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    try:
        scene.view_settings.view_transform = view
    except TypeError:
        scene.view_settings.view_transform = "Filmic"
    scene.view_settings.exposure = exposure
    return scene


def render_still(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path


# ----------------------------------------------------------------------------- nodes
_ALIASES = {
    "Coat Weight": ["Coat Weight", "Clearcoat"],
    "Coat Roughness": ["Coat Roughness", "Clearcoat Roughness"],
    "Sheen Weight": ["Sheen Weight", "Sheen"],
    "Specular IOR Level": ["Specular IOR Level", "Specular"],
    "Emission Color": ["Emission Color", "Emission"],
}


def set_input(node, name, value):
    for n in _ALIASES.get(name, [name]):
        if n in node.inputs:
            node.inputs[n].default_value = value
            return True
    return False


def new_material(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat, nt, bsdf


def _mix_color(nt, fac_socket_or_val, a, b, blend="MIX"):
    node = nt.nodes.new("ShaderNodeMix")
    node.data_type = "RGBA"
    node.blend_type = blend
    ids = {s.identifier: s for s in node.inputs}
    if isinstance(fac_socket_or_val, (int, float)):
        ids["Factor_Float"].default_value = fac_socket_or_val
    else:
        nt.links.new(fac_socket_or_val, ids["Factor_Float"])
    for key, val in (("A_Color", a), ("B_Color", b)):
        if isinstance(val, (tuple, list)):
            ids[key].default_value = (*val[:3], 1.0)
        else:
            nt.links.new(val, ids[key])
    return node, [s for s in node.outputs if s.identifier == "Result_Color"][0]


def leather_material(name, rgb, roughness=0.36, grain_per_m=700.0, grain_strength=1.2,
                     sheen=0.30, tone_variation=0.10, seed=1.0):
    """Nappa-style leather. Realism comes from: pebble grain bump, low-frequency waviness,
    roughness variation (creases are rougher), subtle tone variation, a little sheen. NOT from colour alone."""
    mat, nt, b = new_material(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (grain_per_m,) * 3
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.voronoi_dimensions = "3D"
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Randomness"].default_value = 1.0
    if "W" in vor.inputs and vor.voronoi_dimensions == "4D":
        vor.inputs["W"].default_value = seed
    nt.links.new(mp.outputs["Vector"], vor.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")  # crevice mask: 0 in creases, 1 on cell tops
    ramp.color_ramp.elements[0].position = 0.02
    ramp.color_ramp.elements[1].position = 0.22
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    mp2 = nt.nodes.new("ShaderNodeMapping")
    mp2.inputs["Scale"].default_value = (14.0,) * 3  # waviness / soft creases
    nt.links.new(tc.outputs["Object"], mp2.inputs["Vector"])
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 1.0
    noise.inputs["Detail"].default_value = 6.0
    noise.inputs["Roughness"].default_value = 0.6
    nt.links.new(mp2.outputs["Vector"], noise.inputs["Vector"])
    # height = grain cells + waviness
    h = nt.nodes.new("ShaderNodeMath"); h.operation = "MULTIPLY_ADD"
    nt.links.new(ramp.outputs["Color"], h.inputs[0]); h.inputs[1].default_value = 0.75
    nt.links.new(noise.outputs["Fac"], h.inputs[2])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = grain_strength
    bump.inputs["Distance"].default_value = 0.0006
    nt.links.new(h.outputs["Value"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    # roughness: base + noise variation + rougher creases
    rv = nt.nodes.new("ShaderNodeMapRange")
    rv.inputs["To Min"].default_value = roughness - 0.07
    rv.inputs["To Max"].default_value = roughness + 0.07
    nt.links.new(noise.outputs["Fac"], rv.inputs["Value"])
    cr = nt.nodes.new("ShaderNodeMath"); cr.operation = "MULTIPLY_ADD"
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
    nt.links.new(ramp.outputs["Color"], inv.inputs[1])
    nt.links.new(inv.outputs["Value"], cr.inputs[0]); cr.inputs[1].default_value = 0.12
    nt.links.new(rv.outputs["Result"], cr.inputs[2])
    nt.links.new(cr.outputs["Value"], b.inputs["Roughness"])
    # tone variation (never a flat colour)
    dark = tuple(c * (1.0 - tone_variation * 2.5) for c in rgb)
    mixn, mixout = _mix_color(nt, noise.outputs["Fac"], rgb, dark)
    nt.links.new(mixout, b.inputs["Base Color"])
    set_input(b, "Sheen Weight", sheen)
    set_input(b, "Sheen Roughness", 0.5)
    set_input(b, "Specular IOR Level", 0.45)
    return mat


def thread_material(name, rgb, roughness=0.7):
    mat, nt, b = new_material(name)
    set_input(b, "Base Color", (*rgb, 1.0))
    set_input(b, "Roughness", roughness)
    set_input(b, "Sheen Weight", 0.5)
    return mat


def satin_material(name, rgb, roughness=0.35, metallic=0.0):
    mat, nt, b = new_material(name)
    set_input(b, "Base Color", (*rgb, 1.0)); set_input(b, "Roughness", roughness); set_input(b, "Metallic", metallic)
    return mat


# ----------------------------------------------------------------------------- shape finishing
def bevel_and_smooth(obj, width=0.0012, segments=3, angle_deg=35.0):
    """Hard CG edges are the #1 tell. Real edges always catch light. Bevel + weighted normals + smooth shading."""
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bv = obj.modifiers.new("Bevel", "BEVEL")
    bv.width = width; bv.segments = segments; bv.limit_method = "ANGLE"; bv.angle_limit = math.radians(angle_deg)
    try:
        bv.harden_normals = True
    except Exception:
        pass
    obj.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL").keep_sharp = True
    bpy.ops.object.shade_smooth()
    return obj


# ----------------------------------------------------------------------------- parametric seat-style panel
def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def flute_height_fn(w, h, flutes, depth, bulge, border, groove):
    """Returns z(x,y) for a fluted, pillowed panel with a flat stitched border band."""
    hw, hh = w / 2.0, h / 2.0

    def z(x, y):
        dx, dy = hw - abs(x), hh - abs(y)
        edge = min(dx, dy)
        fade = smoothstep(border * 0.6, border * 1.6, edge)  # flutes flatten into the border
        u = (x + hw) / w * flutes
        frac = u - math.floor(u)
        ridge = math.sin(math.pi * frac) ** 0.42  # rounded tops, sharp valleys
        pillow = bulge * smoothstep(0.0, hw * 0.9, dx) * smoothstep(0.0, hh * 0.9, dy)
        zz = pillow + fade * depth * ridge
        # stitch groove sits just inside the border band
        gd = abs(edge - border * 0.9)
        zz -= groove * math.exp(-(gd / (border * 0.12)) ** 2)
        return zz
    return z


def flute_panel(name, w=0.42, h=0.55, flutes=8, depth=0.012, bulge=0.025, border=0.035,
                groove=0.0015, res=(300, 400), thickness=0.010):
    z = flute_height_fn(w, h, flutes, depth, bulge, border, groove)
    nx, ny = res
    bm = bmesh.new()
    grid = [[None] * (ny + 1) for _ in range(nx + 1)]
    for i in range(nx + 1):
        x = -w / 2 + w * i / nx
        for j in range(ny + 1):
            y = -h / 2 + h * j / ny
            grid[i][j] = bm.verts.new((x, y, z(x, y)))
    for i in range(nx):
        for j in range(ny):
            bm.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]))
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    sol = obj.modifiers.new("Solidify", "SOLIDIFY"); sol.thickness = -thickness; sol.offset = 1.0
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    for p in me.polygons:
        p.use_smooth = True
    return obj, z


def _capsule(bm, centre, tangent, normal, length, radius, sides=6):
    t = tangent.normalized(); n = normal.normalized(); s = t.cross(n).normalized()
    ring = []
    for end in (-1, 1):
        base = centre + t * (end * length / 2)
        ring.append([bm.verts.new(base + (s * math.cos(a) + n * math.sin(a)) * radius)
                     for a in [2 * math.pi * k / sides for k in range(sides)]])
    for k in range(sides):
        bm.faces.new((ring[0][k], ring[0][(k + 1) % sides], ring[1][(k + 1) % sides], ring[1][k]))
    for r in ring:
        bm.faces.new(r if r is ring[1] else r[::-1])


def stitch_polyline(name, pts, z_fn, spacing=0.006, length=0.0045, radius=0.00075, lift=0.0004, mat=None):
    """Dash stitches along a closed 2D polyline (list of (x,y)), sitting on the surface z_fn. Real stitching is
    geometry with a tiny lift and a visible thread colour, not a texture line."""
    bm = bmesh.new()
    seg = list(zip(pts, pts[1:] + pts[:1]))
    carry = 0.0
    eps = 0.0008
    for (x0, y0), (x1, y1) in seg:
        L = math.hypot(x1 - x0, y1 - y0)
        d = spacing - carry if carry else 0.0
        while d <= L:
            t = d / L
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            zc = z_fn(x, y) + lift
            tx, ty = (x1 - x0) / L, (y1 - y0) / L
            zt = (z_fn(x + tx * eps, y + ty * eps) - z_fn(x - tx * eps, y - ty * eps)) / (2 * eps)
            nrm = Vector((-tx * zt * 0.0, -ty * zt * 0.0, 1.0))
            _capsule(bm, Vector((x, y, zc)), Vector((tx, ty, zt)), nrm, length, radius)
            d += spacing
        carry = (d - L) if d > L else 0.0
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    for p in me.polygons:
        p.use_smooth = True
    if mat:
        obj.data.materials.append(mat)
    return obj


def rect_path(w, h, inset, corner=0.02, n=10):
    """Rounded-rectangle polyline (closed) inset from the panel edge."""
    hw, hh = w / 2 - inset, h / 2 - inset
    c = corner
    pts = []
    for (cx, cy, a0) in ((hw - c, hh - c, 0), (-hw + c, hh - c, 90), (-hw + c, -hh + c, 180), (hw - c, -hh + c, 270)):
        for k in range(n + 1):
            a = math.radians(a0 + 90.0 * k / n)
            pts.append((cx + c * math.cos(a), cy + c * math.sin(a)))
    return pts


def piping(name, pts, z_fn, radius=0.0035, mat=None):
    """Piping/welt along an edge: a bevelled curve. Adds the soft rolled edge real upholstery has."""
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"
    sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1); sp.use_cyclic_u = True
    for p, (x, y) in zip(sp.points, pts):
        p.co = (x, y, z_fn(x, y) + radius * 0.4, 1.0)
    cu.bevel_depth = radius; cu.bevel_resolution = 4
    obj = bpy.data.objects.new(name, cu)
    bpy.context.scene.collection.objects.link(obj)
    if mat:
        cu.materials.append(mat)
    return obj


# ----------------------------------------------------------------------------- look-dev
def studio_world(scene, bottom=0.01, top=0.30, tint=(1.0, 1.0, 1.05)):
    """Gradient studio environment. A flat dark world gives NO reflections, which is why leather looks like clay.
    Even a simple bright-top gradient adds the soft broad reflections real surfaces show."""
    world = bpy.data.worlds.new("Studio"); world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Generated"], sep.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[0].color = (bottom, bottom, bottom, 1)
    ramp.color_ramp.elements[1].position = 0.85; ramp.color_ramp.elements[1].color = (top * tint[0], top * tint[1], top * tint[2], 1)
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.0
    scene.world = world


def area_light(name, loc, target, size, energy, size_y=None, rgb=(1, 1, 1)):
    ld = bpy.data.lights.new(name, "AREA"); ld.energy = energy; ld.size = size
    if size_y:
        ld.shape = "RECTANGLE"; ld.size_y = size_y
    ld.color = rgb
    lo = bpy.data.objects.new(name, ld); bpy.context.scene.collection.objects.link(lo)
    lo.location = loc
    d = Vector(target) - Vector(loc)
    lo.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return lo


def studio_lighting(scene, target=(0, 0, 0), scale=1.0):
    """Key (large soft), fill (very large, low), rim (thin strip). Big sources = soft realistic highlights."""
    studio_world(scene)
    area_light("Key", (-1.1 * scale, -1.3 * scale, 1.2 * scale), target, 1.3, 70 * scale ** 2, 0.9)
    area_light("Fill", (1.6 * scale, -1.0 * scale, 0.3 * scale), target, 2.2, 18 * scale ** 2)
    area_light("Rim", (0.9 * scale, 1.1 * scale, 0.7 * scale), target, 0.25, 60 * scale ** 2, 1.6, (0.9, 0.95, 1.0))


def add_camera(scene, loc, target, focal=70.0, fstop=6.3, focus=None):
    cd = bpy.data.cameras.new("Cam"); cd.lens = focal
    cd.dof.use_dof = fstop is not None
    if fstop:
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus or (Vector(loc) - Vector(target)).length
    co = bpy.data.objects.new("Cam", cd); scene.collection.objects.link(co)
    co.location = loc
    co.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.camera = co
    return co


# ----------------------------------------------------------------------------- material lab
def material_lab(make_material, path, size=0.10, w=480, h=315, samples=32, focal=100.0, dist=0.26, tilt_deg=25.0):
    """Render ONE material on a small plane under raking light. Iterate materials here (seconds per render)
    before committing them to a full scene (minutes per render). Grain, sheen and roughness breakup must be
    visible HERE or they will not exist in the final render."""
    sc = reset_scene(); set_render(sc, w, h, samples, view="AgX")
    mat = make_material()  # build AFTER reset_scene(): resetting deletes any material created earlier
    bpy.ops.mesh.primitive_plane_add(size=size)
    plane = bpy.context.object; plane.data.materials.append(mat)
    plane.rotation_euler = (math.radians(tilt_deg), 0, 0)
    studio_world(sc)
    area_light("Key", (-0.45, -0.35, 0.28), (0, 0, 0), 0.5, 6, 0.35)
    area_light("Rake", (0.55, 0.05, 0.10), (0, 0, 0), 0.15, 5, 0.6)
    add_camera(sc, (0, -dist, 0.07), (0, 0, 0), focal=focal, fstop=None)
    return render_still(sc, path)


# ----------------------------------------------------------------------------- export
def gltf_export_params():
    """List the REAL export argument names for the installed Blender (they change between versions)."""
    return sorted(bpy.ops.export_scene.gltf.get_rna_type().properties.keys())


def export_glb(path, selected_only=True, draco=True, apply_modifiers=True):
    """Export GLB with explicit arguments. Only passes arguments that exist in this Blender version."""
    want = dict(filepath=path, export_format="GLB", use_selection=selected_only, export_yup=True,
                export_apply=apply_modifiers, export_cameras=False, export_lights=False, export_extras=True,
                export_draco_mesh_compression_enable=draco)
    have = set(gltf_export_params())
    args = {k: v for k, v in want.items() if k in have}
    skipped = sorted(set(want) - set(args))
    bpy.ops.export_scene.gltf(**args)
    return args, skipped
