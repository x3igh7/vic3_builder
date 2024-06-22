import ProductionResult from '@/interfaces/production-result';

export default interface ProductionMethod {
  name: string;
  unlocking_technologies: string[];
  inputs: ProductionResult[];
  outputs?: ProductionResult[];
}
