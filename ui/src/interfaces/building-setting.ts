import ProductionMethod from '@/interfaces/production-method';

export default interface BuildingSetting {
  name: string;
  unlocking_technologies?: string[];
  productionMethodGroups: { name: string; currentMethod: ProductionMethod }[];
}
