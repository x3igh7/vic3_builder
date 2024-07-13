import { ReactElement, useEffect, useState } from 'react';
import Building from '@/interfaces/building';
import {
  calculateBuildingChainDeltas,
  calculateBuildingChainOutputs,
  calculateBuildingChains,
} from '@/utils/calculate-building-chain';
import BuildingChain from '@/interfaces/building-chain';
import { css } from '@emotion/react';
import { useLocalStorage } from 'primereact/hooks';
import BuildingSetting from '@/interfaces/building-setting';

const BuildingChainResults = ({
  selectedBuilding,
  quantity,
}: {
  selectedBuilding: Building | undefined;
  quantity: number | null;
}): ReactElement => {
  const [settings] = useLocalStorage<BuildingSetting[]>([], 'settings_v2');
  const [currentBuildingChains, setCurrentBuildingChains] = useState<BuildingChain[][]>([]);

  useEffect(() => {
    if (selectedBuilding && quantity && settings.length) {
      // calculate building chain
      const result = calculateBuildingChains(selectedBuilding, quantity, settings);
      setCurrentBuildingChains([...result]);
    }
  }, [selectedBuilding, quantity, settings]);

  const getBuildingChainItems = (currentBuildingChain: BuildingChain[]) => {
    return currentBuildingChain.map((chainItem) => {
      return (
        <div key={chainItem.name} css={css({ '> *': { marginRight: '1rem' } })}>
          <label>{chainItem.name}: </label>
          <span css={css({ color: '#9eade6' })}>{chainItem.quantity}</span>
        </div>
      );
    });
  };

  const getBuildingChainOutputDeltaResults = (currentBuildingChain: BuildingChain[]) => {
    const deltaResults = calculateBuildingChainDeltas(currentBuildingChain);
    const totalOutputs = calculateBuildingChainOutputs(currentBuildingChain);
    return deltaResults.map((delta) => {
      const styleColor = delta.amount < 0 ? 'red' : 'green';
      const total = totalOutputs.find((output) => output.good === delta.good)?.amount || 0;

      return (
        <div key={delta.good} css={css({ '> *': { marginRight: '1rem' } })}>
          <label>{delta.good}</label>
          <span css={{ color: 'var(--text-color-secondary)' }}>Total: {total}</span>
          <span css={{ color: styleColor }}>Excess: {delta.amount}</span>
        </div>
      );
    });
  };

  const getBuildingChainRequestTechs = (currentBuildingChain: BuildingChain[]) => {
    const techs = currentBuildingChain.flatMap((chainItem) => chainItem.requiredTechs) || [];
    if (!techs.length) {
      return <div>No technologies required</div>;
    }

    return techs.map((tech) => {
      return (
        <div key={tech}>
          <label>{tech}</label>
        </div>
      );
    });
  };

  const getPossibleBuildingChains = () => {
    return currentBuildingChains.map((buildingChain, currentIndex) => {
      return (
        <div css={css({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' })} key={currentIndex}>
          <div css={css({ flex: '1 auto' })}>
            <h3>Buildings</h3>
            {getBuildingChainItems(buildingChain)}
          </div>
          <div css={css({ flex: '1 auto' })}>
            <h3>Output Deltas</h3>
            {getBuildingChainOutputDeltaResults(buildingChain)}
          </div>
          <div css={css({ flex: '1 auto' })}>
            <h3>Required Technologies</h3>
            {getBuildingChainRequestTechs(buildingChain)}
          </div>
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
      {getPossibleBuildingChains()}
    </div>
  );
};

export default BuildingChainResults;
