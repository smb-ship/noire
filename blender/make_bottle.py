# NOIRÉ bottle — run in Blender (Scripting tab → Run Script) or headless via `bpy`.
# Outputs: public/bottle.glb, blender/noire_bottle.blend
import bpy, math, os, random
random.seed(7)
HERE = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else bpy.path.abspath("//")
ROOT = os.path.abspath(os.path.join(HERE, ".."))
bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, color, metal=0.0, rough=0.2, trans=0.0, ior=1.45, coat=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    def s(keys, v):
        for k in keys:
            if k in b.inputs: b.inputs[k].default_value = v; return
    s(["Base Color"], color); s(["Metallic"], metal); s(["Roughness"], rough)
    s(["Transmission Weight", "Transmission"], trans); s(["IOR"], ior)
    s(["Coat Weight", "Clearcoat"], coat); s(["Coat Roughness", "Clearcoat Roughness"], 0.03)
    if emit: s(["Emission Color", "Emission"], emit); s(["Emission Strength"], 0.4)
    return m

black = mat("BlackGlass", (0.01, 0.01, 0.012, 1), 0.0, 0.06, 0, 1.5, 1.0)
gold  = mat("ChampagneGold", (0.86, 0.72, 0.45, 1), 1.0, 0.16)
dark  = mat("LabelInk", (0.015, 0.012, 0.01, 1), 0.3, 0.35)
brushed = mat("BrushedGold", (0.9, 0.76, 0.48, 1), 1.0, 0.32)
amber = mat("AmberResin", (0.75, 0.38, 0.06, 1), 0.0, 0.08, 0.85, 1.55, 0.0, (0.5, 0.2, 0.02, 1))

def finish(o, m, name, bevel=None, smooth=True):
    o.name = name; o.data.materials.append(m)
    if bevel:
        md = o.modifiers.new("Bevel", "BEVEL"); md.width = bevel; md.segments = 8; md.limit_method = "ANGLE"
    if smooth: bpy.ops.object.shade_smooth()
    return o
def cube(loc, size, m, name, bevel=None):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = size
    bpy.ops.object.transform_apply(scale=True); return finish(o, m, name, bevel)
def cyl(loc, r, h, m, name, bevel=None, verts=96):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc); o = bpy.context.object
    return finish(o, m, name, bevel)

# Bottle (Z up here; glTF export converts to Y up). Total height ≈ 3.3, base on z = 0.
cube((0, 0, 0.9), (0.85, 0.5, 0.9), black, "Body", 0.11)           # 1.7 x 1.0 x 1.8
cube((0, 0, 1.86), (0.34, 0.34, 0.08), black, "Shoulder", 0.04)
cyl((0, 0, 2.05), 0.25, 0.3, black, "Neck")
cyl((0, 0, 2.23), 0.33, 0.1, gold, "Collar", 0.02)
cyl((0, 0, 2.32), 0.28, 0.08, black, "CollarInset")
cyl((0, 0, 2.78), 0.34, 0.84, gold, "Cap", 0.025)                   # polished gold cap
for i in range(36):                                                  # fluted ribs
    a = i / 36 * math.tau
    bpy.ops.mesh.primitive_cube_add(location=(math.cos(a) * 0.345, math.sin(a) * 0.345, 2.78))
    r = bpy.context.object; r.scale = (0.012, 0.03, 0.4); r.rotation_euler[2] = a
    finish(r, gold, f"Rib{i}")
cyl((0, 0, 3.22), 0.30, 0.05, gold, "CapTop", 0.015)

# Label: gold plate → dark inset → gold frame → engraved text, on the front (-Y)
cube((0, -0.505, 0.85), (0.5, 0.012, 0.5), gold, "LabelPlate", 0.01)
cube((0, -0.52, 0.85), (0.43, 0.01, 0.43), brushed, "LabelInset2")
bpy.ops.object.text_add(location=(0, -0.535, 0.9), rotation=(math.pi / 2, 0, 0))
t = bpy.context.object; t.data.body = "NOIRÉ"; t.data.align_x = "CENTER"; t.data.size = 0.2; t.data.extrude = 0.004
t.name = "LabelText"; bpy.ops.object.convert(target="MESH"); t = bpy.context.object; t.data.materials.append(dark)
bpy.ops.object.text_add(location=(0, -0.535, 0.62), rotation=(math.pi / 2, 0, 0))
t2 = bpy.context.object; t2.data.body = "EAU DE PARFUM"; t2.data.align_x = "CENTER"; t2.data.size = 0.065
t2.name = "LabelSub"; bpy.ops.object.convert(target="MESH"); bpy.context.object.data.materials.append(dark)

# Amber resin crystals (beside the bottle)
for i, (x, y, s) in enumerate([(1.35, -0.55, 0.38), (-1.3, -0.35, 0.3), (1.0, 0.7, 0.22)]):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=s, location=(x, y, s * 0.7))
    o = bpy.context.object
    for v in o.data.vertices:
        v.co.x *= 1 + random.uniform(-.25, .25); v.co.y *= 1 + random.uniform(-.25, .25); v.co.z *= 1 + random.uniform(-.3, .1)
    finish(o, amber, f"Resin{i}", smooth=False)

# Preview render (optional, skipped inside the GLB)
if os.environ.get("NOIRE_RENDER"):
    sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.samples = 48; sc.cycles.device = "CPU"
    sc.render.resolution_x = sc.render.resolution_y = 720
    w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.01, 0.01, 0.01, 1)
    bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); bpy.context.object.data.materials.append(mat("Floor", (0.02, 0.02, 0.02, 1), 0, 0.12))
    for loc, e, c in [((3, -4, 4), 800, (1, .85, .6)), ((-4, -2, 2), 400, (.7, .8, 1)), ((0, 4, 3), 500, (1, .9, .7))]:
        bpy.ops.object.light_add(type="AREA", location=loc); l = bpy.context.object; l.data.energy = e; l.data.size = 3; l.data.color = c
        d = l.constraints.new("TRACK_TO"); d.target = None
        l.rotation_euler = (math.radians(65), 0, math.atan2(loc[0], -loc[1]) * -1 + math.pi if False else 0)
    bpy.ops.object.camera_add(location=(2.8, -6, 2.4)); cam = bpy.context.object; sc.camera = cam
    cam.rotation_euler = (math.radians(78), 0, math.radians(25)); cam.data.lens = 70
    for o in list(bpy.data.objects):
        if o.type == "LIGHT": o.constraints.clear(); o.rotation_euler = (math.radians(55), 0, math.radians(25 if o.location.x > 0 else -35))
    sc.render.filepath = os.path.join(ROOT, "blender", "preview.png"); bpy.ops.render.render(write_still=True)
    for o in list(bpy.data.objects):
        if o.type in ("LIGHT", "CAMERA") or o.name.startswith("Plane"): bpy.data.objects.remove(o)

os.makedirs(os.path.join(ROOT, "public"), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blender", "noire_bottle.blend"))
bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT, "public", "bottle.glb"), export_format="GLB", export_apply=True)
print("DONE")
