"""
setting the intersection point location
"""

import bpy
import mathutils

o = mathutils.Vector(
    (-0.6644037009916183, 0.7650471279982637, -5.463079837981784))
d = mathutils.Vector(
    (-0.9504153660239719, 0.1289895787632641, -0.42275895461910906))
t = -0.0006024248312037655

#o = bpy.data.objects['origin'].matrix_world.to_translation()
# d = bpy.data.objects['direction'].matrix_world.to_translation()

p = o + t * d
p1 = o * (1 - t) + t * d

bpy.data.objects['origin'].location = o
bpy.data.objects['direction'].location = d
bpy.data.objects['hitpoint'].location = p
bpy.data.objects['hitpoint1'].location = p1

print(o)
print(d)
print(p)
