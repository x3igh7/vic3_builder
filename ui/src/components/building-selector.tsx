import { ReactElement, useEffect, useState } from 'react';
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primereact/autocomplete';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import Building from '@/interfaces/building';
import { css } from '@emotion/react';

const BuildingSelector = ({
  buildings,
  selectedBuilding,
  buildingQuantity,
  onSelectedBuildingChange,
  onBuildingQuantityChange,
}: {
  buildings: Building[];
  selectedBuilding: Building | undefined;
  buildingQuantity: number | null;
  onSelectedBuildingChange: (selectedBuilding: Building) => void;
  onBuildingQuantityChange: (buildingQuantity: number) => void;
}): ReactElement => {
  const [filterValue, setFilterValue] = useState<string>();
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);

  useEffect(() => {
    setFilteredBuildings(buildings);
  }, [buildings]);

  useEffect(() => {
    if (selectedBuilding) {
      setFilterValue(selectedBuilding.displayName);
    }
  }, [selectedBuilding]);

  const handleFilterChange = (e: AutoCompleteChangeEvent) => {
    setFilterValue(e.value);
  };

  const handleBuildingSearch = (e: AutoCompleteCompleteEvent) => {
    setFilteredBuildings(
      buildings.filter((building) => building.displayName.toLowerCase().includes(e.query.toLowerCase())),
    );
  };

  const handleSelectedBuildingChange = (e: AutoCompleteSelectEvent) => {
    onSelectedBuildingChange(e.value);
  };

  const handleBuildingQuantityChange = (e: InputNumberChangeEvent) => {
    onBuildingQuantityChange(e.value as number);
  };

  return (
    <div>
      <div css={css({ marginBottom: '1rem' })}>
        <label htmlFor="buildingSelector" css={css({ marginRight: '1rem' })}>
          Building Type
        </label>
        <AutoComplete
          inputId="buildingSelector"
          field={'displayName'}
          suggestions={filteredBuildings}
          value={filterValue}
          completeMethod={handleBuildingSearch}
          onChange={handleFilterChange}
          onSelect={handleSelectedBuildingChange}
          dropdown
          dropdownMode={'current'}
          forceSelection
        ></AutoComplete>
      </div>
      <div>
        <label htmlFor="quantityInput" css={css({ marginRight: '1rem' })}>
          Quantity
        </label>
        <InputNumber
          inputId="quantityInput"
          value={buildingQuantity}
          onChange={handleBuildingQuantityChange}
        ></InputNumber>
      </div>
    </div>
  );
};

export default BuildingSelector;
