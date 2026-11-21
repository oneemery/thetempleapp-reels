# Temple test shot: felt cross on a hill at dusk with light rays. Renders on the Colab GPU.
import bpy, math, os, sys, time
OUT = '/content/out'; os.makedirs(OUT, exist_ok=True)
FRAMES = int(sys.argv[1]) if len(sys.argv) > 1 else 1
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
# ---- GPU ----
cp = bpy.context.preferences.addons['cycles'].preferences
dev = 'NONE'
for kind in ('OPTIX', 'CUDA'):
    try:
        cp.compute_device_type = kind; cp.get_devices()
        gpus = [d for d in cp.devices if d.type == kind]
        if gpus:
            for d in cp.devices: d.use = d.type == kind
            dev = kind + ': ' + ', '.join(d.name for d in gpus); break
    except Exception as e:
        print('no', kind, e)
print('DEVICE', dev, flush=True)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'GPU' if dev != 'NONE' else 'CPU'
sc.cycles.samples = 96; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
sc.render.fps = 30; sc.frame_start, sc.frame_end = 1, 120
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'

def mat(name, col, rough=0.9, sheen=0.6, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Sheen Weight'].default_value = sheen
    if emit: b.inputs['Emission Color'].default_value = (*emit[0], 1); b.inputs['Emission Strength'].default_value = emit[1]
    # felt fuzz bump
    nt = m.node_tree; tex = nt.nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = 180; tex.inputs['Detail'].default_value = 8
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.25
    nt.links.new(tex.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

# ---- world: purple dusk sky + light fog for rays ----
w = bpy.data.worlds.new('dusk'); sc.world = w; w.use_nodes = True
nt = w.node_tree; bg = nt.nodes['Background']
grad = nt.nodes.new('ShaderNodeTexGradient'); grad.gradient_type = 'LINEAR'
coord = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
mp.inputs['Rotation'].default_value = (0, math.radians(90), 0)
ramp = nt.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = (0.55, 0.22, 0.32, 1); ramp.color_ramp.elements[1].color = (0.06, 0.02, 0.14, 1)
nt.links.new(coord.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], grad.inputs['Vector'])
nt.links.new(grad.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = 1.2
vol = nt.nodes.new('ShaderNodeVolumePrincipled'); vol.inputs['Density'].default_value = 0.012
vol.inputs['Color'].default_value = (1.0, 0.85, 0.7, 1)
nt.links.new(vol.outputs['Volume'], nt.nodes['World Output'].inputs['Volume'])

# ---- hills (layered felt) ----
def hill(x, y, z, sx, sy, sz, col):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=(x, y, z))
    o = bpy.context.object; o.scale = (sx, sy, sz); bpy.ops.object.shade_smooth()
    o.data.materials.append(mat('hill', col)); return o
hill(0, 0, -6.2, 9, 9, 6.6, (0.20, 0.10, 0.30))
hill(-14, 18, -8, 16, 10, 9.5, (0.12, 0.06, 0.20))
hill(16, 24, -9, 18, 10, 10.2, (0.09, 0.04, 0.16))
# ---- cross ----
wood = mat('wood', (0.05, 0.025, 0.02), rough=0.8, sheen=0.3)
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0.4 + 2.2)); v = bpy.context.object; v.scale = (0.16, 0.16, 2.2); v.data.materials.append(wood)
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 3.4)); h = bpy.context.object; h.scale = (1.15, 0.15, 0.15); h.data.materials.append(wood)
for o in (v, h):
    bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.03; bv.segments = 3
# ---- sun behind cross ----
bpy.ops.object.light_add(type='SUN', location=(0, 30, 6)); sun = bpy.context.object
sun.data.energy = 4.0; sun.data.color = (1.0, 0.72, 0.45); sun.data.angle = math.radians(2)
sun.rotation_euler = (math.radians(-80), 0, math.radians(180))
bpy.ops.mesh.primitive_uv_sphere_add(radius=4, location=(0, 60, 5)); disc = bpy.context.object
disc.data.materials.append(mat('sundisc', (1, 0.8, 0.5), emit=((1.0, 0.75, 0.45), 18)))
bpy.ops.object.light_add(type='AREA', location=(-6, -8, 6)); fill = bpy.context.object
fill.data.energy = 300; fill.data.color = (0.6, 0.5, 1.0); fill.data.size = 6
fill.rotation_euler = (math.radians(60), 0, math.radians(-35))
# ---- camera: slow push in ----
bpy.ops.object.camera_add(location=(0, -16, 2.2)); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 40; cam.data.dof.use_dof = True; cam.data.dof.focus_object = v; cam.data.dof.aperture_fstop = 2.8
tgt = bpy.data.objects.new('tgt', None); sc.collection.objects.link(tgt); tgt.location = (0, 0, 2.6)
tc = cam.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
cam.location = (0, -16, 2.2); cam.keyframe_insert('location', frame=1)
cam.location = (0, -12.5, 2.6); cam.keyframe_insert('location', frame=120)

t0 = time.time()
for f in range(1, FRAMES + 1):
    sc.frame_set(f); sc.render.filepath = f'{OUT}/f{f:04d}.png'
    bpy.ops.render.render(write_still=True)
    print(f'frame {f} done, {time.time() - t0:.1f}s total', flush=True)
print('AVG_PER_FRAME', round((time.time() - t0) / FRAMES, 2))
