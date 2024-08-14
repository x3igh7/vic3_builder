import BuildingSetting from '@/interfaces/building-setting';
import Good from '@/interfaces/good';
import Building from '@/interfaces/building';
import BuildingEfficiency from '@/interfaces/building-efficiency';
import { getTotalSettingInputPerBuilding, getTotalSettingOutputPerBuilding } from '@/utils/calculate-building-chain';

const getInputsValue = (setting: BuildingSetting, goods: Good[]) => {
  const totalInputs = getTotalSettingInputPerBuilding(setting);
  return totalInputs.reduce<number>((inputsValue, input) => {
    const currentGood = goods.find((good) => good.name === input.good);
    if (currentGood) {
      return inputsValue + input.amount * currentGood.cost;
    }
    return inputsValue;
  }, 0);
};

const getOutputsValue = (setting: BuildingSetting, goods: Good[]) => {
  const totalOutputs = getTotalSettingOutputPerBuilding(setting);
  return totalOutputs.reduce<number>((outputsValue, output) => {
    const currentGood = goods.find((good) => good.name === output.good);
    if (currentGood) {
      return outputsValue + output.amount * currentGood.cost;
    }
    return outputsValue;
  }, 0);
};

const getNetValue = (inputsValue: number, outputsValue: number) => {
  if (outputsValue === 0 && inputsValue === 0) {
    return undefined;
  }
  return outputsValue - inputsValue;
};

const getConstructionEfficiency = (
  buildingName: string,
  inputsValue: number,
  outputsValue: number,
  buildings: Building[],
) => {
  if (inputsValue === 0 && outputsValue === 0) {
    return undefined;
  }
  const building = buildings.find((b) => b.name === buildingName);
  const netValue = getNetValue(inputsValue, outputsValue);
  if (building?.required_construction && netValue) {
    const weeklyConstructionCost = building?.required_construction / 20;
    return netValue / weeklyConstructionCost;
  }

  return undefined;
};

const getPriceEfficiency = (inputsValue: number, outputsValue: number) => {
  if (!inputsValue || !outputsValue) {
    return undefined;
  }
  return (outputsValue / inputsValue) * 100;
};

const calculateBuildingEfficiency = (
  buildingSetting: BuildingSetting,
  goods: Good[],
  buildings: Building[],
): BuildingEfficiency => {
  const inputsValue = getInputsValue(buildingSetting, goods);
  const outputsValue = getOutputsValue(buildingSetting, goods);
  const constructionEfficiency = getConstructionEfficiency(buildingSetting.name, inputsValue, outputsValue, buildings);
  const priceFlexibility = getPriceEfficiency(inputsValue, outputsValue);
  const netValue = getNetValue(inputsValue, outputsValue);

  return {
    name: buildingSetting.name,
    constructionEfficiency: constructionEfficiency,
    priceFlexibility: priceFlexibility,
    netValue,
  };
};

export { calculateBuildingEfficiency, getInputsValue, getOutputsValue };
