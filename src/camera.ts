import Vec3 from './vec3';
import Ray from './ray';

export default class Camera {
  private origin: Vec3;
  private lower_left_corner: Vec3;
  private horizontal: Vec3;
  private vertical: Vec3;

  public constructor(width: number, height: number) {
    const aspect_ratio = width / height;
    const viewport_height = 2;
    const viewport_width = aspect_ratio * viewport_height;
    const focal_length = 1.0;

    this.origin = new Vec3(0, 0, 0);
    this.horizontal = new Vec3(viewport_width, 0, 0);
    this.vertical = new Vec3(0, viewport_height, 0);

    const half_horizontal = Vec3.divScalarVec(this.horizontal, 2);
    const half_vertical = Vec3.divScalarVec(this.vertical, 2);

    this.lower_left_corner = Vec3.subVec3(
      Vec3.subVec3(Vec3.subVec3(this.origin, half_horizontal), half_vertical),
      new Vec3(0, 0, focal_length)
    );
  }

  public get_ray(u: number, v: number): Ray {
    const vecU = Vec3.multScalarVec3(this.horizontal, u);
    const vecV = Vec3.multScalarVec3(this.vertical, v);

    return new Ray(
      this.origin,
      Vec3.subVec3(Vec3.addVec3(Vec3.addVec3(this.lower_left_corner, vecU), vecV), this.origin)
    );
  }
}
