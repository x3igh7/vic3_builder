import ProductionMethod from '@/interfaces/production-method';

export default interface BuildingSetting {
  name: string;
  unlocking_technologies?: string[];
  production_method_groups: { name: string; currentMethod: ProductionMethod }[];
}
