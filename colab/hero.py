# Hero shot: the Cross Part 3 opening as a real 3D camera move (low sweep up and around the cross).
# usage: python hero.py [first last]
import os, sys, math, time, random
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temple3d.py')).read()
src = src.split('# ---------------- shots ----------------')[0]
F0 = int(sys.argv[1]) if len(sys.argv) > 1 else 1
F1 = int(sys.argv[2]) if len(sys.argv) > 2 else 318
sys.argv = ['x', 'golgotha', 'cycles']
exec(src)
import bpy
from mathutils import Vector
sc = bpy.context.scene
LEN = 318; sc.frame_end = LEN
sc.render.resolution_percentage = 100
if os.environ.get('TEST'): sc.render.resolution_percentage = 20
sc.cycles.samples = 8 if os.environ.get('TEST') else 64
sc.cycles.volume_step_rate = 3
sc.view_settings.look = 'AgX - Punchy'
OUTH = os.environ.get('OUTDIR', '/content/out') + '/hero'; os.makedirs(OUTH, exist_ok=True)
R = random.Random(11)

world((0.015, 0.006, 0.03), 1.0, 0)
# sky: deep indigo top, magenta band, hot orange horizon
sky, sky_e, ramp = sky_backdrop(70, [(1.0, 0.42, 0.16), (0.55, 0.1, 0.32), (0.025, 0.01, 0.08)])
stars(220, 68, 12, 45)
m_sun, e_sun = emit('sun', (1.0, 0.72, 0.42), 45)
bpy.ops.mesh.primitive_uv_sphere_add(radius=6, location=(0, 62, 4.0)); sun = bpy.context.object; sun.data.materials.append(m_sun); sun.visible_shadow = False
# far felt ranges
for i, (y, z0, amp, col, seed) in enumerate([(48, 3.0, 4.6, (0.2, 0.08, 0.26), 3), (36, 2.0, 3.6, (0.14, 0.055, 0.21), 5), (24, 0.6, 2.6, (0.1, 0.04, 0.16), 8)]):
    profile_layer(f'range{i}', y, z0, amp, col, seed, width=140)
# the hill: a real felt mound, lumpy
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, location=(0, 0, -2.75)); hill = bpy.context.object
hill.scale = (7.5, 7.0, 3.1); bpy.ops.object.transform_apply(scale=True); bpy.ops.object.shade_smooth()
tex = bpy.data.textures.new('lumps', 'CLOUDS'); tex.noise_scale = 1.6
dm = hill.modifiers.new('lumps', 'DISPLACE'); dm.texture = tex; dm.strength = 0.35
hill.data.materials.append(felt('hill', (0.16, 0.07, 0.22), bump=0.5))
# ground around it
bpy.ops.mesh.primitive_plane_add(size=120, location=(0, 0, -1.25)); ground = bpy.context.object
gt = bpy.data.textures.new('ground', 'CLOUDS'); gt.noise_scale = 3.0
bpy.ops.object.modifier_add(type='SUBSURF'); ground.modifiers['Subdivision'].levels = 6; ground.modifiers['Subdivision'].subdivision_type = 'SIMPLE'
gd = ground.modifiers.new('g', 'DISPLACE'); gd.texture = gt; gd.strength = 0.5
ground.data.materials.append(felt('ground', (0.07, 0.03, 0.1), bump=0.6))
# the cross: rough felt wood with grain
cr = cross((0, 0, 0.32))
for o in cr:
    m = o.data.materials[0]; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    wave = nt.nodes.new('ShaderNodeTexWave'); wave.inputs['Scale'].default_value = 2.5; wave.inputs['Distortion'].default_value = 6
    mixc = nt.nodes.new('ShaderNodeMix'); mixc.data_type = 'RGBA'
    mixc.inputs['A'].default_value = (0.045, 0.022, 0.015, 1); mixc.inputs['B'].default_value = (0.11, 0.055, 0.035, 1)
    nt.links.new(wave.outputs['Fac'], mixc.inputs['Factor']); nt.links.new(mixc.outputs['Result'], b.inputs['Base Color'])
# felt stones and grass tufts near the camera path: they sell the parallax
stone_m = felt('stone', (0.2, 0.15, 0.24), bump=0.6); grass_m = felt('grass', (0.09, 0.12, 0.08), bump=0.3)
for i in range(70):
    a = R.uniform(math.radians(200), math.radians(340)); r = R.uniform(3.5, 12)
    x, y = r * math.cos(a), r * math.sin(a)
    if R.random() < 0.45:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=R.uniform(0.15, 0.5), location=(x, y, -1.15))
        o = bpy.context.object; o.scale = (1, R.uniform(0.7, 1.2), R.uniform(0.45, 0.8)); bpy.ops.object.shade_smooth(); o.data.materials.append(stone_m)
    else:
        for k in range(R.randint(3, 6)):
            h = R.uniform(0.3, 0.8)
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.04, depth=h, location=(x + R.uniform(-0.15, 0.15), y + R.uniform(-0.15, 0.15), -1.2 + h / 2))
            o = bpy.context.object; o.rotation_euler = (R.uniform(-0.35, 0.35), R.uniform(-0.35, 0.35), 0); o.data.materials.append(grass_m)
# light: big warm rim from the sun, purple fill, warm key on the cross
bpy.ops.object.light_add(type='SUN', location=(0, 40, 10)); s = bpy.context.object
s.data.energy = 6.0; s.data.color = (1.0, 0.68, 0.4); s.data.angle = math.radians(1.2)
s.rotation_euler = (math.radians(-97), 0, math.radians(180))
bpy.ops.object.light_add(type='AREA', location=(-8, -12, 7)); fl = bpy.context.object
fl.data.energy = 900; fl.data.color = (0.5, 0.42, 1.0); fl.data.size = 10; fl.rotation_euler = (math.radians(58), 0, math.radians(-32))
bpy.ops.object.light_add(type='SPOT', location=(2, -5, 7)); kp = bpy.context.object
kp.data.energy = 900; kp.data.color = (1, 0.75, 0.5); kp.data.spot_size = math.radians(25); kp.data.shadow_soft_size = 1.0
kp.rotation_euler = (math.radians(38), 0, math.radians(20))
# god rays: fog around the hill, the cross cuts shadows into it
fog = fog_box(0.028); fog.location = (0, 16, 5); fog.scale = (22, 30, 10)
fog.data.materials[0].node_tree.nodes['Principled Volume'].inputs['Anisotropy'].default_value = 0.8
dust(260, ((-6, 6), (-8, 6), (-0.8, 7)), drift=(0, 0, 0.18))
# "AM" in gold rises over the cross when the voice says it
am = text3d('AM', 1.5, (0, -1.2, 5.6), gold('gold', 0.8), 'AM', extrude=0.12)
am.scale = (0.001, 0.001, 0.001); am.keyframe_insert('scale', frame=1); am.keyframe_insert('scale', frame=268)
am.scale = (1, 1, 1); am.keyframe_insert('scale', frame=282)
# camera: low in the grass, sweeps up and around to the right of the cross
camera([(1, (-5.8, -11.5, -0.55)), (120, (-3.6, -9.6, 0.6)), (230, (-0.5, -8.4, 2.4)), (LEN, (3.4, -7.2, 3.9))],
       [(1, (0, 0, 2.1)), (LEN, (0, 0, 3.4))], lens=26, fstop=1.8, focus=cr[0])
t0 = time.time(); n = 0
for f in range(F0, F1 + 1):
    sc.frame_set(f); sc.render.filepath = f'{OUTH}/f{f:04d}.jpg'
    bpy.ops.render.render(write_still=True); n += 1
    if f % 20 == 0 or f == F0: print(f'hero frame {f} {time.time() - t0:.0f}s', flush=True)
print('HERO_DONE', round((time.time() - t0) / max(1, n), 2), 's/frame', flush=True)
