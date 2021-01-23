"""
creating random spheres within blender
"""

# import math
import random
import bpy
import bmesh
import mathutils


def clear(collection):
    """
    clear the collection
    """

    print("delete spheres")

    for obj in [o for o in collection.objects if o.type == 'MESH']:
        mesh = obj.data
        bpy.data.objects.remove(obj)

        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)


def create_lambertian(color):
    """
    create a lambertion material
    """
    material = bpy.data.materials.new(name="Lambertian")
    material.use_nodes = True
    nodes = material.node_tree.nodes

    # remove principled
    material.node_tree.nodes.remove(
        material.node_tree.nodes.get('Principled BSDF'))

    # get material output
    material_output = material.node_tree.nodes.get('Material Output')

    # Add a diffuse shader and set its location:
    diffuse_node = nodes.new('ShaderNodeBsdfDiffuse')
    diffuse_node.inputs['Color'].default_value = color

    # link diffuse shader to material
    material.node_tree.links.new(
        material_output.inputs[0], diffuse_node.outputs[0])

    return material


def create_metal(color, roughness):
    """
    create a metal material
    """
    material = bpy.data.materials.new(name="Metal")
    material.use_nodes = True
    nodes = material.node_tree.nodes

    # remove principled
    material.node_tree.nodes.remove(
        material.node_tree.nodes.get('Principled BSDF'))

    # get material output
    material_output = material.node_tree.nodes.get('Material Output')

    # Add a metal shader and set its location:
    diffuse_node = nodes.new('ShaderNodeBsdfGlossy')
    diffuse_node.inputs['Color'].default_value = color
    diffuse_node.inputs['Roughness'].default_value = roughness

    # link diffuse shader to material
    material.node_tree.links.new(
        material_output.inputs[0], diffuse_node.outputs[0])

    return material


def create_dielectric(index_of_refraction):
    """
    create a dielectric material
    """
    material = bpy.data.materials.new(name="Dielectric")
    material.use_nodes = True
    nodes = material.node_tree.nodes

    # remove principled
    material.node_tree.nodes.remove(
        material.node_tree.nodes.get('Principled BSDF'))

    # get material output
    material_output = material.node_tree.nodes.get('Material Output')

    # Add a metal shader and set its location:
    diffuse_node = nodes.new('ShaderNodeBsdfGlass')
    #diffuse_node.inputs['Color'].default_value = color
    diffuse_node.inputs['IOR'].default_value = index_of_refraction

    # link diffuse shader to material
    material.node_tree.links.new(
        material_output.inputs[0], diffuse_node.outputs[0])

    return material


def create_sphere(collection, name, position, radius, material):
    """
    create a sphere
    """

    mesh = bpy.data.meshes.new(name)

    sphere = bpy.data.objects.new(name, mesh)

    # bpy.ops.mesh.primitive_uv_sphere_add()
    # bpy.ops.object.shade_smooth()
    # subSurfMod = bpy.ops.object.modifier_add(type='SUBSURF')
    # subSurfMod.render_levels = 3

    new_bmesh = bmesh.new()
    bmesh.ops.create_uvsphere(
        new_bmesh,
        u_segments=32,
        v_segments=16,
        diameter=radius,
        matrix=mathutils.Matrix.Identity(4),
        calc_uvs=True)

    # Convert BMesh to mesh data, then release BMesh.
    new_bmesh.to_mesh(mesh)
    new_bmesh.free()

    collection.objects.link(sphere)

    # set smooth
    for face in sphere.data.polygons:
        face.use_smooth = True

    # create subdiv modifier
    subsurf_modifier = sphere.modifiers.new('Subdivision', 'SUBSURF')
    subsurf_modifier.render_levels = 3

    # set location
    sphere.location = position

    # set material
    sphere.active_material = material


# get the collection "random_spheres"
random_spheres_collection = bpy.data.collections["random_spheres"]

clear(random_spheres_collection)

RANGE_VALUE = 11

for a in range(-RANGE_VALUE, RANGE_VALUE):
    for b in range(-RANGE_VALUE, RANGE_VALUE):

        center = mathutils.Vector(
            (a + 0.9 * random.random(), 0.2, b + 0.9 * random.random()))
        sub_vec = center - mathutils.Vector((4.0, 0.2, 0.0))

        if sub_vec.length > 0.9:
            choose_mat = random.random()
            # print(choose_mat)

            if choose_mat < 0.8:
                v1 = mathutils.Vector(
                    (random.random(), random.random(), random.random()))
                v2 = mathutils.Vector(
                    (random.random(), random.random(), random.random()))

                albedo = v1*v2
                lambertian = create_lambertian(
                    color=(albedo.x, albedo.y, albedo.z, 1.0))

                create_sphere(
                    collection=random_spheres_collection,
                    name="awesome_lambertion_sphere",
                    position=center,
                    radius=0.2,
                    material=lambertian
                )
            elif choose_mat < 0.95:
                albedo = mathutils.Vector(
                    (random.uniform(0.5, 1), random.uniform(0.5, 1), random.uniform(0.5, 1)))
                metal = create_metal(
                    color=(albedo.x, albedo.y, albedo.z, 1.0), roughness=random.uniform(0.0, 0.5))

                create_sphere(
                    collection=random_spheres_collection,
                    name="awesome_metal_sphere",
                    position=center,
                    radius=0.2,
                    material=metal
                )

            else:
                dielectric = create_dielectric(index_of_refraction=1.5)

                create_sphere(
                    collection=random_spheres_collection,
                    name="awesome_sphere",
                    position=center,
                    radius=0.2,
                    material=dielectric
                )

print("sphere creation done")
