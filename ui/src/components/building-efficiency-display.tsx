import BuildingSetting from '@/interfaces/building-setting';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import BuildingEfficiency from '@/interfaces/building-efficiency';
import { calculateBuildingEfficiency } from '@/utils/calculate-building-efficiency';
import useDataHook from '@/hooks/use-data-hook';
import { css } from '@emotion/react';

const BuildingEfficiencyDisplay = ({ buildingSetting }: { buildingSetting: BuildingSetting }): ReactElement => {
  const { goods, buildings } = useDataHook();
  const [currentBuildingEfficiency, setCurrentBuildingEfficiency] = useState<BuildingEfficiency | undefined>(undefined);

  const buildingEfficiency = useMemo(() => {
    if (buildingSetting && goods.length && buildings.length) {
      return calculateBuildingEfficiency(buildingSetting, goods, buildings);
    }
  }, [buildingSetting, goods, buildings]);

  useEffect(() => {
    setCurrentBuildingEfficiency(buildingEfficiency);
  }, [buildingEfficiency]);

  if (
    currentBuildingEfficiency &&
    (currentBuildingEfficiency.constructionEfficiency ||
      currentBuildingEfficiency.priceFlexibility ||
      currentBuildingEfficiency.netValue) &&
    !(
      (currentBuildingEfficiency.constructionEfficiency || 0) < 0 ||
      (currentBuildingEfficiency.priceFlexibility || 0) < 0 ||
      (currentBuildingEfficiency.netValue || 0) < 0
    )
  ) {
    return (
      <div css={css({ display: 'flex', gap: '1rem' })}>
        <span css={css({ color: 'var(--text-color-secondary)' })}>(</span>
        {currentBuildingEfficiency.constructionEfficiency !== undefined ? (
          <div>
            <span css={css({ color: 'var(--text-color)' })}>Construction Efficiency:</span>{' '}
            <span css={css({ color: 'var(--highlight-text-color)' })}>
              {currentBuildingEfficiency.constructionEfficiency.toFixed(1)}&#37;
            </span>
          </div>
        ) : (
          <></>
        )}
        {currentBuildingEfficiency.priceFlexibility !== undefined ? (
          <div>
            <span css={css({ color: 'var(--text-color)' })}>Price Flexibility:</span>{' '}
            <span css={css({ color: 'var(--highlight-text-color)' })}>
              {currentBuildingEfficiency.priceFlexibility.toFixed(0)}&#37;
            </span>
          </div>
        ) : (
          <></>
        )}
        {currentBuildingEfficiency.netValue !== undefined ? (
          <div>
            <span css={css({ color: 'var(--text-color)' })}>Net Value:</span>{' '}
            <span css={css({ color: 'var(--highlight-text-color)' })}>+{currentBuildingEfficiency.netValue}</span>
          </div>
        ) : (
          <></>
        )}
        <span css={css({ color: 'var(--text-color-secondary)' })}>)</span>
      </div>
    );
  } else {
    return <></>;
  }
};

export default BuildingEfficiencyDisplay;
