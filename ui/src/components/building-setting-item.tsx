'use client';

import { ReactElement } from 'react';
import BuildingSetting from '@/interfaces/building_setting';
import Building from '@/interfaces/building';
import ProductionMethodGroup from '@/interfaces/production-method-group';
import ProductionMethod from '@/interfaces/production_method';
import ProductionMethodGroupItem from '@/components/production-method-group-item';

const BuildingSettingItem = ({
  building,
  productionMethodGroups,
  productionMethods,
  buildingSetting,
  onSettingChange,
}: {
  building: Building;
  productionMethodGroups: ProductionMethodGroup[];
  productionMethods: ProductionMethod[];
  buildingSetting: BuildingSetting;
  onSettingChange: (setting: BuildingSetting) => void;
}): ReactElement => {
  const handleSelectedProductionMethodChange = (
    selectedProductionMethod: ProductionMethod,
  ) => {};

  const generateProductionMethodGroupSelectors = (): ReactElement[] => {
    const buildingProductionMethodGroups = productionMethodGroups.filter(
      (group) => building.production_method_groups.includes(group.name),
    );

    return buildingProductionMethodGroups.map((group) => {
      const groupProductionMethods = productionMethods.filter((method) =>
        group.production_methods.includes(method.name),
      );
      const selectedProductionMethod =
        buildingSetting.productionMethodGroups.find(
          (settingGroup) => settingGroup.name === group.name,
        )?.currentMethod;

      return (
        <div key={group.name}>
          <ProductionMethodGroupItem
            name={group.name}
            groupProductionMethods={groupProductionMethods}
            selectedProductionMethod={
              selectedProductionMethod
                ? selectedProductionMethod
                : groupProductionMethods[0]
            }
            onSelectedProductionMethodChange={
              handleSelectedProductionMethodChange
            }
          />
        </div>
      );
    });
  };

  return (
    <div>
      <div>
        <label>{building.name}</label>
      </div>
    </div>
  );
};

export default BuildingSettingItem;
