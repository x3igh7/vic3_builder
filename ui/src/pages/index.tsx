import { useState } from 'react';
import Building from '@/interfaces/building';
import BuildingSelector from '@/components/building-selector';
import useDataHook from '@/hooks/use-data-hook';
import BuildingChainResults from '@/components/building-chain-results';

export default function Home() {
  const [buildingSelected, setBuildingSelected] = useState<Building>();
  const [buildingQuantity, setBuildingQuantity] = useState<number | null>(5);
  const { buildings } = useDataHook();

  const handleSelectedBuildingChange = (changedBuildingSelected: Building) => {
    setBuildingSelected(changedBuildingSelected);
  };

  const handleBuildingQuantityChange = (changedBuildingQuantity: number) => {
    setBuildingQuantity(changedBuildingQuantity);
  };

  return (
    <main>
      <h1>Vic3 Builder</h1>
      <BuildingSelector
        buildings={buildings}
        selectedBuilding={buildingSelected}
        buildingQuantity={buildingQuantity}
        onSelectedBuildingChange={handleSelectedBuildingChange}
        onBuildingQuantityChange={handleBuildingQuantityChange}
      />
      <BuildingChainResults selectedBuilding={buildingSelected} quantity={buildingQuantity}></BuildingChainResults>
    </main>
  );
}
