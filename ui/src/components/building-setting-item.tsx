import { ReactElement } from 'react';
import BuildingSetting from '@/interfaces/building-setting';
import Building from '@/interfaces/building';
import ProductionMethodGroup from '@/interfaces/production-method-group';
import ProductionMethod from '@/interfaces/production-method';
import ProductionMethodGroupItem from '@/components/production-method-group-item';
import { css } from '@emotion/react';

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
  const handleSelectedProductionMethodChange = (groupName: string, selectedProductionMethod: ProductionMethod) => {
    onSettingChange({
      ...buildingSetting,
      production_method_groups: buildingSetting.production_method_groups.map((group) => {
        if (group.name === groupName) {
          return { ...group, currentMethod: selectedProductionMethod };
        }
        return group;
      }),
    });
  };

  const generateProductionMethodGroupSelectors = (): ReactElement[] => {
    const buildingProductionMethodGroups = productionMethodGroups.filter((group) =>
      building.production_method_groups.includes(group.name),
    );

    return buildingProductionMethodGroups.map((group) => {
      const groupProductionMethods = productionMethods.filter((method) =>
        group.production_methods.includes(method.name),
      );
      const selectedProductionMethod = buildingSetting.production_method_groups.find(
        (settingGroup) => settingGroup.name === group.name,
      )?.currentMethod;

      return (
        <div key={group.name}>
          <ProductionMethodGroupItem
            name={group.name}
            displayName={group.displayName}
            groupProductionMethods={groupProductionMethods}
            selectedProductionMethod={selectedProductionMethod ? selectedProductionMethod : groupProductionMethods[0]}
            onSelectedProductionMethodChange={handleSelectedProductionMethodChange}
          />
        </div>
      );
    });
  };

  return (
    <div css={{ marginBottom: '1rem' }}>
      <h3>
        <label>{building?.displayName}</label>
      </h3>
      <div
        css={css({
          display: 'flex',
          flexFlow: 'row wrap',
          alignContent: 'center',
          gap: '1rem',
        })}
      >
        {generateProductionMethodGroupSelectors()}
      </div>
    </div>
  );
};

export default BuildingSettingItem;
