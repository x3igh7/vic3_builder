import ProductionMethod from '@/interfaces/production-method';

export default interface BuildingSetting {
  name: string;
  productionMethodGroups: { name: string; currentMethod: ProductionMethod }[];
}
