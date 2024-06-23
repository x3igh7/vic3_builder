import { ReactElement, useEffect, useState } from 'react';
import Building from '@/interfaces/building';
import useDataHook from '@/hooks/use-data-hook';
import {
  calculateBuildingChain,
  calculateBuildingChainDeltas,
  calculateBuildingChainOutputs,
} from '@/utils/calculate-building-chain';
import BuildingChain from '@/interfaces/building-chain';
import { css } from '@emotion/react';

const BuildingChainResults = ({
  selectedBuilding,
  quantity,
}: {
  selectedBuilding: Building | undefined;
  quantity: number | null;
}): ReactElement => {
  const { settings } = useDataHook();
  const [currentBuildingChain, setCurrentBuildingChain] = useState<BuildingChain[]>([]);

  useEffect(() => {
    if (selectedBuilding && quantity) {
      // calculate building chain
      const result = calculateBuildingChain(selectedBuilding, quantity, settings);
      setCurrentBuildingChain(result);
    }
  }, [selectedBuilding]);

  const getBuildingChainItems = () => {
    return currentBuildingChain.map((chainItem) => {
      return (
        <div key={chainItem.name} css={css({ '> *': { marginRight: '1rem' } })}>
          <label>{chainItem.name}: </label>
          <span css={css({ color: '#9eade6' })}>{chainItem.quantity}</span>
        </div>
      );
    });
  };

  const getBuildingChainOutputDeltaResults = () => {
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

  const getBuildingChainRequestTechs = () => {
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

  if (!selectedBuilding || !quantity) {
    return <div></div>;
  }
  return (
    <div>
      <h2>Building Chain Results</h2>
      <div css={css({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' })}>
        <div css={css({ flex: '1 auto' })}>
          <h3>Buildings</h3>
          {getBuildingChainItems()}
        </div>
        <div css={css({ flex: '1 auto' })}>
          <h3>Output Deltas</h3>
          {getBuildingChainOutputDeltaResults()}
        </div>
        <div css={css({ flex: '1 auto' })}>
          <h3>Required Technologies</h3>
          {getBuildingChainRequestTechs()}
        </div>
      </div>
    </div>
  );
};

export default BuildingChainResults;
