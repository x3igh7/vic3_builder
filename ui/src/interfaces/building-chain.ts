import ProductionResult from '@/interfaces/production-result';

export default interface BuildingChain {
  name: string; // building name
  quantity: number;
  totalInputs: ProductionResult[];
  totalOutputs: ProductionResult[];
}
