import { ReactElement, useEffect, useState } from 'react';
import Building from '@/interfaces/building';
import {
  calculateBuildingChainInputDeltas,
  calculateBuildingChainOutputs,
  calculateBuildingChains,
  sortChainsByTotalRequiredBuildings,
} from '@/utils/calculate-building-chain';
import BuildingChain from '@/interfaces/building-chain';
import { css } from '@emotion/react';
import { useLocalStorage } from 'primereact/hooks';
import BuildingSetting from '@/interfaces/building-setting';
import { useTranslation } from 'react-i18next';

const BuildingChainResults = ({
  selectedBuilding,
  quantity,
}: {
  selectedBuilding: Building | undefined;
  quantity: number | null;
}): ReactElement => {
  const { t } = useTranslation();
  const [settings] = useLocalStorage<BuildingSetting[]>([], 'settings_v4');
  const [currentBuildingChains, setCurrentBuildingChains] = useState<BuildingChain[][]>([]);

  useEffect(() => {
    if (selectedBuilding && quantity && settings.length) {
      // calculate building chain
      let result = calculateBuildingChains(selectedBuilding, quantity, settings);
      result = sortChainsByTotalRequiredBuildings(result);
      setCurrentBuildingChains([...result]);
    }
  }, [selectedBuilding, quantity, settings]);

  const getBuildingChainItems = (currentBuildingChain: BuildingChain[]) => {
    return currentBuildingChain.map((chainItem) => {
      return (
        <div key={chainItem.name} css={css({ '> *': { marginRight: '1rem' } })}>
          <label>{chainItem.displayName}: </label>
          <span css={css({ color: '#9eade6' })}>{chainItem.quantity}</span>
        </div>
      );
    });
  };

  const getBuildingChainOutputDeltaResults = (currentBuildingChain: BuildingChain[]) => {
    const deltaResults = calculateBuildingChainInputDeltas(currentBuildingChain);
    const totalOutputs = calculateBuildingChainOutputs(currentBuildingChain);
    return totalOutputs.map((output) => {
      let delta = deltaResults.find((result) => output.good === result.good);
      const deltaAmount = delta !== undefined ? delta.amount : output.amount;
      const styleColor = deltaAmount < 0 ? 'red' : 'green';

      return (
        <div key={output.good} css={css({ '> *': { marginRight: '1rem' } })}>
          <label>{t(output.good)}</label>
          <span css={{ color: 'var(--text-color-secondary)' }}>Total: {output.amount}</span>
          <span css={{ color: styleColor }}>Excess: {deltaAmount}</span>
        </div>
      );
    });
  };

  const getBuildingChainRequestTechs = (currentBuildingChain: BuildingChain[]) => {
    const techs = currentBuildingChain.flatMap((chainItem) => chainItem.requiredTechs) || [];
    const deDupedList = Array.from(new Set(techs));
    if (!deDupedList.length) {
      return <div>No technologies required</div>;
    }

    return deDupedList.map((tech) => {
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
            <h3>Outputs</h3>
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
