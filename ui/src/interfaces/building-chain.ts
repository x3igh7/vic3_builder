import ProductionResult from '@/interfaces/production-result';

export default interface BuildingChain {
  name: string; // building name
  requiredTechs?: string[];
  quantity: number;
  totalInputs: ProductionResult[];
  totalOutputs: ProductionResult[];
}
