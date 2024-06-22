import { ReactElement, useEffect, useState } from 'react';
import Building from '@/interfaces/building';
import useDataHook from '@/hooks/use-data-hook';
import { calculateBuildingChain, calculateBuildingChainDeltas } from '@/utils/calculate-building-chain';
import BuildingChain from '@/interfaces/building-chain';
import { css } from '@emotion/react';

const BuildingChainResults = ({
  selectedBuilding,
  quantity,
}: {
  selectedBuilding: Building | undefined;
  quantity: number | null;
}): ReactElement => {
  const { buildings, productionMethods, productionMethodGroups, settings } = useDataHook();
  const [currentBuildingChain, setCurrentBuildingChain] = useState<BuildingChain[]>([]);

  useEffect(() => {
    if (selectedBuilding && quantity) {
      // calculate building chain
      const result = calculateBuildingChain(
        selectedBuilding,
        quantity,
        buildings,
        productionMethodGroups,
        productionMethods,
        settings,
      );
      setCurrentBuildingChain(result);
    }
  }, [selectedBuilding]);

  const getBuildingChainItems = () => {
    return currentBuildingChain.map((chainItem) => {
      return (
        <div key={chainItem.name}>
          <label>{chainItem.name}: </label>
          <span>Quantity: {chainItem.quantity}</span>
        </div>
      );
    });
  };

  const getBuildingChainOutputDeltaResults = () => {
    const deltaResults = calculateBuildingChainDeltas(currentBuildingChain);
    return deltaResults.map((delta) => {
      const styleColor = delta.amount < 0 ? 'red' : 'green';

      return (
        <div key={delta.good}>
          <label>{delta.good}</label>
          <span css={{ color: styleColor }}>Excess Output: {delta.amount}</span>
        </div>
      );
    });
  };

  if (!selectedBuilding || !quantity) {
    return <div></div>;
  }
  return (
    <div>
      <h2>Building Chain Results</h2>
      <div css={css({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' })}>
        <div css={css({ flex: '1 auto', maxWidth: '50%' })}>
          <h3>Buildings</h3>
          {getBuildingChainItems()}
        </div>
        <div css={css({ flex: '1 auto', maxWidth: '50%' })}>
          <h3>Output Deltas</h3>
          {getBuildingChainOutputDeltaResults()}
        </div>
      </div>
    </div>
  );
};

export default BuildingChainResults;
