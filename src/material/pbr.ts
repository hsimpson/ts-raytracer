import { Material } from './material';
import { serializable } from '../serializing';

@serializable
export class PBRMaterial extends Material {
  private _albedo: Texture;
}
