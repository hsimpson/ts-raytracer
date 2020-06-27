import vec3 from './vec3';
import ray from './ray';

export default class camera {
  private origin: vec3;
  private lower_left_corner: vec3;
  private horizontal: vec3;
  private vertical: vec3;

  public constructor() {
    const aspect_ratio = 16 / 9;
    const viewport_height = 2;
    const viewport_width = aspect_ratio * viewport_height;
    const focal_length = 1.0;

    this.origin = new vec3(0, 0, 0);
    this.horizontal = new vec3(viewport_width, 0, 0);
    this.vertical = new vec3(0, viewport_height, 0);

    const half_horizontal = vec3.divScalarVec(this.horizontal, 2);
    const half_vertical = vec3.divScalarVec(this.vertical, 2);

    this.lower_left_corner = vec3.subVec3(
      vec3.subVec3(vec3.subVec3(this.origin, half_horizontal), half_vertical),
      new vec3(0, 0, focal_length)
    );
  }

  public get_ray(u: number, v: number): ray {
    const vecU = vec3.multScalarVec3(this.horizontal, u);
    const vecV = vec3.multScalarVec3(this.vertical, v);

    return new ray(
      this.origin,
      vec3.subVec3(vec3.addVec3(vec3.addVec3(this.lower_left_corner, vecU), vecV), this.origin)
    );
  }
}
