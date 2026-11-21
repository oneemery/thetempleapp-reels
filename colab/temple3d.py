# Temple 3D: felt diorama shots for Cross Part 3, rendered with Blender on the Colab GPU.
# usage: python temple3d.py SHOT ENGINE [first last step]
#   SHOT: golgotha | walls | rise     ENGINE: eevee | cycles
import bpy, math, os, random, sys, time
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, 'assets')
SHOT, ENGINE = sys.argv[1], sys.argv[2]
LEN = {'golgotha': 312, 'walls': 297, 'rise': 378}[SHOT]
F0 = int(sys.argv[3]) if len(sys.argv) > 3 else 1
F1 = int(sys.argv[4]) if len(sys.argv) > 4 else LEN
STEP = int(sys.argv[5]) if len(sys.argv) > 5 else 1
OUT = os.environ.get('OUTDIR', '/content/out') + f'/{SHOT}'; os.makedirs(OUT, exist_ok=True)
rnd = random.Random(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
sc.render.fps = 30; sc.frame_start, sc.frame_end = 1, LEN
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Punchy'
except Exception: pass
if os.environ.get('TEST'): sc.render.resolution_percentage = 15
sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 95

if ENGINE == 'cycles':
    cp = bpy.context.preferences.addons['cycles'].preferences
    for kind in ('OPTIX', 'CUDA'):
        try:
            cp.compute_device_type = kind; cp.get_devices()
            if any(d.type == kind for d in cp.devices):
                for d in cp.devices: d.use = d.type == kind
                break
        except Exception: pass
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'GPU'
    sc.cycles.samples = 8 if os.environ.get('TEST') else 48; sc.cycles.use_denoising = True
    try: sc.cycles.denoiser = 'OPTIX'
    except Exception: pass
    if os.environ.get('TEST'): sc.cycles.device = 'CPU'
    sc.cycles.max_bounces = 4; sc.cycles.volume_bounces = 0; sc.cycles.volume_step_rate = 4
else:
    sc.render.engine = 'BLENDER_EEVEE'
    ee = sc.eevee
    for k, v in (('taa_render_samples', 48), ('use_raytracing', True), ('volumetric_tile_size', '4'),
                 ('volumetric_samples', 64), ('use_shadows', True), ('volumetric_ray_depth', 4), ('use_volumetric_shadows', True)):
        try: setattr(ee, k, v)
        except Exception: pass

# ---------------- materials ----------------
def felt(name, col, sheen=0.8, rough=0.95, bump=0.35, scale=220, var=0.08):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = rough
    b.inputs['Sheen Weight'].default_value = sheen; b.inputs['Sheen Roughness'].default_value = 0.6
    b.inputs['Sheen Tint'].default_value = (1, 1, 1, 1)
    n1 = nt.nodes.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = scale; n1.inputs['Detail'].default_value = 12
    n2 = nt.nodes.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 6; n2.inputs['Detail'].default_value = 3
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    mix.inputs['A'].default_value = (*[c * (1 - var) for c in col], 1); mix.inputs['B'].default_value = (*[min(1, c * (1 + var)) for c in col], 1)
    nt.links.new(n2.outputs['Fac'], mix.inputs['Factor']); nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = 0.02
    nt.links.new(n1.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def emit(name, col, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (*col, 1); e.inputs['Strength'].default_value = strength
    nt.links.new(e.outputs['Emission'], nt.nodes['Material Output'].inputs['Surface'])
    return m, e

def gold(name='gold', glow=1.5):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (1.0, 0.55, 0.12, 1); b.inputs['Metallic'].default_value = 1.0; b.inputs['Roughness'].default_value = 0.25
    b.inputs['Emission Color'].default_value = (1.0, 0.6, 0.18, 1); b.inputs['Emission Strength'].default_value = glow
    return m

def sprite_plane(png, height, loc, name):
    img = bpy.data.images.load(os.path.join(A, png))
    w = height * img.size[0] / img.size[1]
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=(math.radians(90), 0, 0))
    o = bpy.context.object; o.name = name; o.scale = (w, height, 1)
    bpy.ops.object.transform_apply(scale=True)
    o.location.z = loc[2] + height / 2
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = img
    nt.links.new(t.outputs['Color'], b.inputs['Base Color']); nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    b.inputs['Roughness'].default_value = 0.9; b.inputs['Sheen Weight'].default_value = 0.5
    try: m.surface_render_method = 'DITHERED'
    except Exception: pass
    o.data.materials.append(m)
    return o

def profile_layer(name, y, z0, amp, col, seed, width=60, thick=0.25, base=-6):
    """A flat felt cut-out hill layer (extruded silhouette), like a paper diorama."""
    r = random.Random(seed); ph = [r.uniform(0, 6.28) for _ in range(3)]
    pts = []
    n = 120
    for i in range(n + 1):
        x = -width / 2 + width * i / n
        zz = z0 + amp * (0.6 * math.sin(x / 5.5 + ph[0]) + 0.3 * math.sin(x / 2.3 + ph[1]) + 0.1 * math.sin(x / 0.9 + ph[2]))
        pts.append((x, zz))
    verts = [(x, 0, z) for x, z in pts] + [(width / 2, 0, base), (-width / 2, 0, base)]
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], [list(range(len(verts)))]); me.update()
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); o.location.y = y
    so = o.modifiers.new('thick', 'SOLIDIFY'); so.thickness = thick; so.offset = 0
    bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.05; bv.segments = 3; bv.limit_method = 'ANGLE'
    o.data.materials.append(felt(name, col))
    return o, pts

def hill_mound(x, y, z, sx, sy, sz, col, name):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, location=(x, y, z))
    o = bpy.context.object; o.name = name; o.scale = (sx, sy, sz); bpy.ops.object.shade_smooth()
    o.data.materials.append(felt(name, col)); return o

def cross(loc, s=1.0):
    wood = felt('wood', (0.06, 0.03, 0.022), sheen=0.5, bump=0.5, scale=90)
    stitch = emit('stitch', (1.0, 0.8, 0.5), 0.0)[0]
    parts = []
    for (dx, dz, sx, sz) in ((0, 2.25, 0.17, 2.25), (0, 3.35, 1.2, 0.16)):
        bpy.ops.mesh.primitive_cube_add(location=(loc[0] + dx * s, loc[1], loc[2] + dz * s))
        o = bpy.context.object; o.scale = (sx * s, 0.17 * s, sz * s)
        bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.04 * s; bv.segments = 4
        o.data.materials.append(wood); parts.append(o)
    return parts

def text3d(txt, size, loc, mat, name, extrude=0.06):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = txt
    cu.font = bpy.data.fonts.load(os.path.join(A, 'Cinzel-Black.ttf'))
    cu.size = size; cu.extrude = extrude; cu.bevel_depth = 0.012; cu.bevel_resolution = 3
    cu.align_x = 'CENTER'; cu.align_y = 'CENTER'
    o = bpy.data.objects.new(name, cu); sc.collection.objects.link(o)
    o.location = loc; o.rotation_euler = (math.radians(90), 0, 0); o.data.materials.append(mat)
    return o

def world(col_top, strength, density):
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
    nt.nodes['Background'].inputs['Color'].default_value = (*col_top, 1); nt.nodes['Background'].inputs['Strength'].default_value = strength
    if density > 0:
        v = nt.nodes.new('ShaderNodeVolumePrincipled'); v.inputs['Density'].default_value = density
        v.inputs['Color'].default_value = (1, 0.9, 0.8, 1); v.inputs['Anisotropy'].default_value = 0.6
        nt.links.new(v.outputs['Volume'], nt.nodes['World Output'].inputs['Volume'])
        return v
    return None

def sky_backdrop(y, cols, name='sky'):
    """Big curved backdrop with a vertical gradient (top -> horizon)."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, y, 40), rotation=(math.radians(90), 0, 0))
    o = bpy.context.object; o.name = name; o.scale = (320, 200, 1)
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    ramp = nt.nodes.new('ShaderNodeValToRGB'); el = ramp.color_ramp.elements
    el[0].position = 0.30; el[0].color = (*cols[0], 1); el[1].position = 0.48; el[1].color = (*cols[2], 1)
    mid = el.new(0.345); mid.color = (*cols[1], 1)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Strength'].default_value = 1.0
    nt.links.new(tc.outputs['UV'], sep.inputs['Vector']); nt.links.new(sep.outputs['Y'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], e.inputs['Color']); nt.links.new(e.outputs['Emission'], nt.nodes['Material Output'].inputs['Surface'])
    o.data.materials.append(m)
    o.visible_shadow = False
    return o, e, ramp

def stars(n, y, zmin, zmax, w=120):
    m, _ = emit('star', (1.0, 0.9, 0.75), 6)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.06, location=(0, y, 30)); base = bpy.context.object; base.data.materials.append(m)
    for i in range(n):
        o = base.copy(); sc.collection.objects.link(o)
        o.location = (rnd.uniform(-w / 2, w / 2), y - rnd.uniform(0, 2), rnd.uniform(zmin, zmax)); s = rnd.uniform(0.6, 2.2); o.scale = (s, s, s)
        o.visible_shadow = False
    bpy.data.objects.remove(base)

def dust(n, box, drift=(0.0, 0.0, 0.25)):
    m, _ = emit('dust', (1.0, 0.85, 0.6), 3)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.018, location=(0, 0, -50)); base = bpy.context.object; base.data.materials.append(m)
    (x0, x1), (y0, y1), (z0, z1) = box
    for i in range(n):
        o = base.copy(); sc.collection.objects.link(o); o.visible_shadow = False
        p = Vector((rnd.uniform(x0, x1), rnd.uniform(y0, y1), rnd.uniform(z0, z1)))
        o.location = p; o.keyframe_insert('location', frame=1)
        o.location = p + Vector((rnd.uniform(-0.6, 0.6), rnd.uniform(-0.3, 0.3), drift[2] * LEN / 30 * rnd.uniform(0.5, 1.5))); o.keyframe_insert('location', frame=LEN)
        for fc in (o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []):
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
    bpy.data.objects.remove(base)

def camera(path, look, lens=35, fstop=2.2, focus=None, ease=True):
    bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam; cam.data.lens = lens
    cam.data.sensor_width = 36
    tgt = bpy.data.objects.new('look', None); sc.collection.objects.link(tgt)
    tc = cam.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
    for f, p in path: cam.location = p; cam.keyframe_insert('location', frame=f)
    for f, p in look: tgt.location = p; tgt.keyframe_insert('location', frame=f)
    if focus is not None:
        cam.data.dof.use_dof = True; cam.data.dof.focus_object = focus; cam.data.dof.aperture_fstop = fstop
    return cam, tgt

def golgotha_set(sun_z, sky_cols):
    sky, sky_e, ramp = sky_backdrop(70, sky_cols)
    stars(140, 68, 14, 40)
    m_sun, e_sun = emit('sun', (1.0, 0.78, 0.5), 25)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=4.5, location=(0, 60, sun_z)); sun = bpy.context.object; sun.data.materials.append(m_sun); sun.visible_shadow = False
    lays = [(46, 2.6, 4.2, (0.16, 0.08, 0.24), 3), (34, 2.0, 3.4, (0.12, 0.055, 0.2), 5), (22, 1.0, 2.6, (0.09, 0.04, 0.16), 8), (12, -0.4, 1.8, (0.065, 0.03, 0.12), 11)]
    for i, (y, z0, amp, col, seed) in enumerate(lays):
        profile_layer(f'hills{i}', y, z0, amp, col, seed, width=110 if y > 30 else 80)
    hill = hill_mound(0, 0, -7.0, 9, 6, 7.4, (0.13, 0.06, 0.2), 'golgotha')
    cr = cross((0, 0, 0.3))
    # rim sun light from behind + cool fill from the front
    bpy.ops.object.light_add(type='SUN', location=(0, 40, 10)); s = bpy.context.object
    s.data.energy = 3.5; s.data.color = (1.0, 0.7, 0.45); s.data.angle = math.radians(1.5)
    s.rotation_euler = (math.radians(-95 + sun_z * 1.2), 0, math.radians(180))
    bpy.ops.object.light_add(type='AREA', location=(-7, -12, 7)); fl = bpy.context.object
    fl.data.energy = 650; fl.data.color = (0.55, 0.45, 1.0); fl.data.size = 8; fl.rotation_euler = (math.radians(58), 0, math.radians(-30))
    bpy.ops.object.light_add(type='POINT', location=(3, -4, 6)); kp = bpy.context.object; kp.data.energy = 120; kp.data.color = (1, 0.8, 0.6); kp.data.shadow_soft_size = 2
    return dict(sky=sky, sky_e=sky_e, ramp=ramp, sun=sun, e_sun=e_sun, sunlight=s, cross=cr, fill=fl)

# ---------------- shots ----------------
if SHOT == 'golgotha':
    vol = world((0.02, 0.008, 0.04), 1.0, 0.018)
    S = golgotha_set(1.2, [(0.95, 0.45, 0.35), (0.45, 0.14, 0.38), (0.05, 0.02, 0.12)])
    dust(160, ((-6, 6), (-6, 4), (0, 6)))
    # "AM" in gold rises in front of the cross when the voice says it (t = 7.4s)
    am = text3d('AM', 1.6, (0, -3.2, 5.2), gold('gold', 2.5), 'AM')
    am.scale = (0.001, 0.001, 0.001); am.keyframe_insert('scale', frame=1); am.keyframe_insert('scale', frame=268)
    am.scale = (1, 1, 1); am.keyframe_insert('scale', frame=280)
    camera([(1, (2.5, -34, 1.2)), (200, (0.6, -17, 2.6)), (LEN, (0, -12.5, 3.4))],
           [(1, (0, 0, 2.2)), (LEN, (0, 0, 3.4))], lens=38, fstop=2.0, focus=S['cross'][0])
elif SHOT == 'walls':
    world((0.01, 0.006, 0.02), 1.0, 0.03)
    floor = bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); bpy.context.object.data.materials.append(felt('floor', (0.05, 0.028, 0.07), bump=0.6))
    def brick_wall(name, x):
        bpy.ops.mesh.primitive_cube_add(location=(x, 2, 3)); o = bpy.context.object; o.name = name; o.scale = (0.4, 9, 3)
        m = felt(name, (0.16, 0.09, 0.2), bump=0.5); nt = m.node_tree; b = nt.nodes['Principled BSDF']
        br = nt.nodes.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = 3.2
        br.inputs['Color1'].default_value = (0.17, 0.09, 0.2, 1); br.inputs['Color2'].default_value = (0.12, 0.065, 0.15, 1); br.inputs['Mortar'].default_value = (0.05, 0.03, 0.07, 1)
        br.inputs['Mortar Size'].default_value = 0.03
        tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
        nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
        bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.6; nt.links.new(br.outputs['Fac'], bm.inputs['Height'])
        nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
        o.data.materials.append(m); bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.05
        return o
    L_ = brick_wall('wallL', -5.5); R_ = brick_wall('wallR', 5.5)
    # walls start drifting in, then close fast on "walls closing in" (t=3.35s -> f100)
    for o, s in ((L_, -1), (R_, 1)):
        o.location.x = s * 5.5; o.keyframe_insert('location', index=0, frame=1)
        o.location.x = s * 4.6; o.keyframe_insert('location', index=0, frame=125)
        o.location.x = s * 1.35; o.keyframe_insert('location', index=0, frame=200)
        o.location.x = s * 1.2; o.keyframe_insert('location', index=0, frame=LEN)
    man = sprite_plane('p2.png', 1.75, (0, 0, 0), 'man')
    # light from above: warm shaft that dies when "heaven went quiet" (t=5.9s -> f177..f230)
    bpy.ops.object.light_add(type='SPOT', location=(0, -0.5, 9)); sp = bpy.context.object
    sp.data.spot_size = math.radians(38); sp.data.spot_blend = 0.4; sp.data.color = (1.0, 0.78, 0.5); sp.data.shadow_soft_size = 0.4
    sp.data.energy = 1500; sp.data.keyframe_insert('energy', frame=1); sp.data.keyframe_insert('energy', frame=225)
    sp.data.energy = 30; sp.data.keyframe_insert('energy', frame=275)
    bpy.ops.object.light_add(type='AREA', location=(0, -8, 3)); cool = bpy.context.object; cool.rotation_euler = (math.radians(80), 0, 0)
    cool.data.color = (0.45, 0.5, 1.0); cool.data.size = 6
    cool.data.energy = 80; cool.data.keyframe_insert('energy', frame=225); cool.data.energy = 650; cool.data.keyframe_insert('energy', frame=275)
    dust(70, ((-2.5, 2.5), (-2, 2), (0.3, 6)), drift=(0, 0, -0.12))
    camera([(1, (0, -11, 1.6)), (LEN, (0, -6.2, 1.25))], [(1, (0, 0, 1.4)), (LEN, (0, 0, 1.1))], lens=32, fstop=2.4, focus=man)
elif SHOT == 'rise':
    vol = world((0.02, 0.01, 0.04), 1.0, 0.02)
    S = golgotha_set(-4.0, [(0.95, 0.45, 0.35), (0.45, 0.14, 0.38), (0.05, 0.02, 0.12)])
    # sun rises behind the cross; sky warms from violet to gold on "resurrection" (t=9.0s -> f270)
    sun = S['sun']
    sun.location.z = -4.0; sun.keyframe_insert('location', index=2, frame=1)
    sun.location.z = -1.0; sun.keyframe_insert('location', index=2, frame=200)
    sun.location.z = 5.5; sun.keyframe_insert('location', index=2, frame=330)
    S['e_sun'].inputs['Strength'].default_value = 12; S['e_sun'].inputs['Strength'].keyframe_insert('default_value', frame=200)
    S['e_sun'].inputs['Strength'].default_value = 60; S['e_sun'].inputs['Strength'].keyframe_insert('default_value', frame=320)
    el = S['ramp'].color_ramp.elements
    for e_, a, b_ in ((el[0], (0.95, 0.45, 0.35, 1), (1.0, 0.78, 0.42, 1)), (el[2], (0.45, 0.14, 0.38, 1), (0.95, 0.55, 0.42, 1))):
        e_.color = a; e_.keyframe_insert('color', frame=200); e_.color = b_; e_.keyframe_insert('color', frame=320)
    sl = S['sunlight']
    sl.data.energy = 1.0; sl.data.keyframe_insert('energy', frame=200); sl.data.energy = 7.0; sl.data.keyframe_insert('energy', frame=320)
    sl.rotation_euler = (math.radians(-100), 0, math.radians(180)); sl.keyframe_insert('rotation_euler', frame=200)
    sl.rotation_euler = (math.radians(-86), 0, math.radians(180)); sl.keyframe_insert('rotation_euler', frame=320)
    dust(200, ((-7, 7), (-6, 4), (0, 7)))
    camera([(1, (1.2, -7.5, 0.9)), (220, (0.6, -11, 2.0)), (LEN, (0, -18, 4.2))],
           [(1, (0, 0, 3.4)), (LEN, (0, 0, 3.0))], lens=34, fstop=2.8, focus=S['cross'][0])

# render
t0 = time.time(); n = 0
for f in range(F0, F1 + 1, STEP):
    sc.frame_set(f); sc.render.filepath = f'{OUT}/f{f:04d}.jpg'
    bpy.ops.render.render(write_still=True); n += 1
    print(f'{SHOT} frame {f} {time.time() - t0:.1f}s', flush=True)
print('AVG_PER_FRAME', round((time.time() - t0) / max(1, n), 2), flush=True)
