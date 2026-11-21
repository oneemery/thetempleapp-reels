# Render 3D felt diorama "plates" once: each depth layer is a separate transparent image.
# The live engine then moves the camera through the layers (parallax), so no per-frame 3D render.
# usage: python plates.py OUTDIR
import os, sys, math, time
OUTP = sys.argv[1] if len(sys.argv) > 1 else '/content/temple/live/cross-part3/p'
os.makedirs(OUTP, exist_ok=True)
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temple3d.py')).read()
src = src.split('# ---------------- shots ----------------')[0]
sys.argv = ['x', 'golgotha', 'cycles']
exec(src)
import bpy
sc = bpy.context.scene
PW, PH = 1350, 2400
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = PW, PH, 100
if os.environ.get('TEST'): sc.render.resolution_percentage = 20
sc.cycles.samples = 8 if os.environ.get('TEST') else 64
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.look = 'AgX - Punchy'

def objs_with_mat(name):
    return [o for o in bpy.data.objects if o.type == 'MESH' and any(m and m.name.startswith(name) for m in o.data.materials)]

def render_layer(fn, keep, transparent=True):
    keep = set(keep)
    for o in bpy.data.objects:
        if o.type in ('MESH', 'FONT', 'CURVE'):
            o.hide_render = o not in keep
    sc.render.film_transparent = transparent
    sc.render.filepath = os.path.join(OUTP, fn)
    t = time.time(); bpy.ops.render.render(write_still=True)
    print(f'plate {fn} {time.time() - t:.1f}s', flush=True)

def clear():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)

def still_camera(loc, look, lens, focus=None, fstop=2.4):
    bpy.ops.object.camera_add(location=loc); cam = bpy.context.object; sc.camera = cam; cam.data.lens = lens
    tgt = bpy.data.objects.new('look', None); sc.collection.objects.link(tgt); tgt.location = look
    tc = cam.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
    if focus is not None: cam.data.dof.use_dof = True; cam.data.dof.focus_object = focus; cam.data.dof.aperture_fstop = fstop
    return cam

T0 = time.time()
# ---------------- golgotha at dusk (hook) and gold (resurrection) ----------------
world((0.02, 0.008, 0.04), 1.0, 0)
S = golgotha_set(1.2, [(0.95, 0.45, 0.35), (0.45, 0.14, 0.38), (0.05, 0.02, 0.12)])
still_camera((0.4, -17, 2.9), (0, 0, 2.6), 33, focus=S['cross'][0], fstop=2.8)
ob = bpy.data.objects
sky = [ob['sky'], ob['fog']] + objs_with_mat('star') + [S['sun']]
far = [ob['hills0'], ob['hills1']]; mid = [ob['hills2'], ob['hills3']]
peakset = [ob['golgotha']] + S['cross']; ledge = [ob['ledge']]
render_layer('g_sky.png', sky, transparent=False)
render_layer('g_far.png', far); render_layer('g_mid.png', mid); render_layer('g_peak.png', peakset); render_layer('g_ledge.png', ledge)
# gold version: sun up, warm sky, strong warm rim light
el = S['ramp'].color_ramp.elements
el[0].color = (1.0, 0.78, 0.42, 1); el[2].color = (0.95, 0.55, 0.42, 1)
S['sunlight'].data.energy = 7.0; S['sunlight'].rotation_euler = (math.radians(-86), 0, math.radians(180))
S['sun'].hide_render = True
render_layer('r_sky.png', [x for x in sky if x != S['sun']], transparent=False)
render_layer('r_far.png', far); render_layer('r_mid.png', mid); render_layer('r_peak.png', peakset); render_layer('r_ledge.png', ledge)
S['sun'].location.z = 3.0; S['e_sun'].inputs['Strength'].default_value = 40
render_layer('r_sun.png', [S['sun']])

# ---------------- the walls ----------------
clear()
world((0.01, 0.006, 0.02), 1.0, 0)
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); floor = bpy.context.object; floor.data.materials.append(felt('floor', (0.05, 0.028, 0.07), bump=0.6))
def brick_wall(name, x):
    bpy.ops.mesh.primitive_cube_add(location=(x, 2, 3)); o = bpy.context.object; o.name = name; o.scale = (0.4, 9, 3)
    m = felt(name, (0.3, 0.17, 0.36), bump=0.5); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    br = nt.nodes.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = 3.2
    br.inputs['Color1'].default_value = (0.3, 0.17, 0.36, 1); br.inputs['Color2'].default_value = (0.22, 0.12, 0.27, 1); br.inputs['Mortar'].default_value = (0.05, 0.03, 0.07, 1)
    br.inputs['Mortar Size'].default_value = 0.03
    tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.6; nt.links.new(br.outputs['Fac'], bm.inputs['Height'])
    nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
    o.data.materials.append(m); bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.05
    return o
wl = brick_wall('wallL', -2.6); wr = brick_wall('wallR', 2.6)
man = sprite_plane('p2.png', 1.75, (0, 0, 0), 'man')
fb = fog_box(0.035); fb.location = (0, 1, 4); fb.scale = (6, 8, 4.5)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 9, 4), rotation=(math.radians(90), 0, 0)); back = bpy.context.object
back.scale = (30, 20, 1); back.data.materials.append(felt('backwall', (0.03, 0.015, 0.05)))
bpy.ops.object.light_add(type='SPOT', location=(0, -0.5, 9)); sp = bpy.context.object
sp.data.spot_size = math.radians(60); sp.data.spot_blend = 0.4; sp.data.color = (1.0, 0.78, 0.5); sp.data.shadow_soft_size = 0.4; sp.data.energy = 4500
bpy.ops.object.light_add(type='AREA', location=(0, -8, 3)); cool = bpy.context.object; cool.rotation_euler = (math.radians(80), 0, 0)
cool.data.color = (0.45, 0.5, 1.0); cool.data.size = 6; cool.data.energy = 80
still_camera((0, -8.6, 1.45), (0, 0, 1.25), 30, focus=man, fstop=2.4)
room = [floor, man, fb, back]
render_layer('w_room_lit.png', room, transparent=False)
render_layer('w_left.png', [wl]); render_layer('w_right.png', [wr])
sp.data.energy = 30; cool.data.energy = 220
render_layer('w_room_dark.png', room, transparent=False)
print('PLATES_DONE', round(time.time() - T0, 1), 's', flush=True)
