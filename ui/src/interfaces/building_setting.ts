import ProductionMethod from '@/interfaces/production_method';

export default interface BuildingSetting {
  name: string;
  productionMethodGroups: { name: string; currentMethod: ProductionMethod }[];
}
