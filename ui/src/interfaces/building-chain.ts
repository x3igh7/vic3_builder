import ProductionResult from '@/interfaces/production-result';

export default interface BuildingChain {
  name: string; // building name
  displayName: string; // building display name
  requiredTechs?: string[];
  quantity: number;
  totalInputs: ProductionResult[];
  totalOutputs: ProductionResult[];
}
