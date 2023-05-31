import { Material } from './material';
import { serializable } from '../serializing';
import { Texture } from '../textures';

@serializable
export class PBRMaterial extends Material {
  private _albedo: Texture;
}
