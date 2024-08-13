import ProductionMethod from '@/interfaces/production-method';

export default interface BuildingSetting {
  name: string;
  displayName: string;
  unlocking_technologies?: string[];
  production_method_groups: { name: string; displayName?: string; currentMethod: ProductionMethod }[];
}
