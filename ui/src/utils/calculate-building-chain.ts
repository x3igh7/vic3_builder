import Building from '@/interfaces/building';
import BuildingSetting from '@/interfaces/building-setting';
import ProductionResult from '@/interfaces/production-result';
import BuildingChain from '@/interfaces/building-chain';

const getTotalSettingInputPerBuilding = (setting: BuildingSetting) => {
  return setting.productionMethodGroups
    .flatMap((group) => {
      if (!group.currentMethod.inputs) {
        return [];
      }

      return group.currentMethod.inputs;
    })
    .reduce<ProductionResult[]>((acc, input) => {
      if (acc.some((a) => a.good === input.good)) {
        const updated = acc.map((a) => {
          if (a.good === input.good) {
            a.amount += input.amount;
          }
          return a;
        });

        return [...updated];
      }

      return [...acc, input];
    }, []);
};

const getTotalSettingOutputPerBuilding = (setting: BuildingSetting) => {
  return setting.productionMethodGroups
    .flatMap((group) => {
      if (!group.currentMethod.outputs) {
        return [];
      }
      return group.currentMethod.outputs;
    })
    .reduce<ProductionResult[]>((acc, output) => {
      if (acc.some((a) => a.good === output.good)) {
        const updated = acc.map((a) => {
          if (a.good === output.good) {
            a.amount += output.amount;
          }
          return a;
        });

        return [...updated];
      }

      return [...acc, output];
    }, []);
};

const getBuildingSettingByGood = (
  good: string,
  settings: BuildingSetting[],
): [setting: BuildingSetting | undefined, outputGood: ProductionResult | undefined] => {
  const setting = settings.find((s) =>
    s.productionMethodGroups.some((g) => g.currentMethod.outputs?.some((o) => o.good === good)),
  ) as BuildingSetting;

  // if no setting found, return undefined
  if (!setting) return [undefined, undefined];

  const outputGood = setting.productionMethodGroups
    .find((g) => g.currentMethod.outputs?.some((o) => o.good === good))
    ?.currentMethod.outputs?.find((o) => o.good === good) as ProductionResult;

  return [setting, outputGood];
};

const calculateBuildingChainInputs = (buildingChain: BuildingChain[]) => {
  const chainInputs = buildingChain.flatMap((building) => {
    return [
      ...building.totalInputs.map((input) => {
        return { ...input };
      }),
    ];
  });
  return chainInputs.reduce<ProductionResult[]>((acc, input) => {
    if (acc.some((a) => a.good === input.good)) {
      const updated = acc.map((a) => {
        if (a.good === input.good) {
          a.amount += input.amount;
        }
        return a;
      });

      return [...updated];
    }

    return [...acc, input];
  }, []);
};

const calculateBuildingChainOutputs = (buildingChain: BuildingChain[]) => {
  const chainOutputs = buildingChain.flatMap((building) => {
    return [
      ...building.totalOutputs.map((output) => {
        return { ...output };
      }),
    ];
  });
  return chainOutputs.reduce<ProductionResult[]>((acc, output) => {
    if (acc.some((a) => a.good === output.good)) {
      const updated = acc.map((a) => {
        if (a.good === output.good) {
          a.amount += output.amount;
        }
        return a;
      });

      return [...updated];
    }

    return [...acc, output];
  }, []);
};

const calculateBuildingChainDeltas = (buildingChain: BuildingChain[]) => {
  const totalChainInputs = calculateBuildingChainInputs(buildingChain);
  const totalChainOutputs = calculateBuildingChainOutputs(buildingChain);

  return totalChainInputs.map((input) => {
    const outputGood = totalChainOutputs.find((output) => output.good === input.good);
    if (outputGood) {
      return { good: input.good, amount: outputGood.amount - input.amount };
    }

    return { good: input.good, amount: 0 - input.amount };
  });
};

const getSettingRequiredTechs = (setting: BuildingSetting) => {
  const buildingTechs = setting?.unlocking_technologies || [];
  const productionTechs = setting.productionMethodGroups?.flatMap(
    (group) => group.currentMethod?.unlocking_technologies || [],
  );
  return [...buildingTechs, ...productionTechs];
};

const recursiveCalculateBuildingChain = (buildingChain: BuildingChain[], settings: BuildingSetting[]) => {
  const totalChainDeltas = calculateBuildingChainDeltas(buildingChain);
  const negativeDeltas = totalChainDeltas.filter((delta) => delta.amount < 0);

  // if there are no negative deltas, the chain is complete
  if (negativeDeltas.length === 0) {
    return buildingChain;
  }

  const delta = negativeDeltas[0];
  // find the building that produces the good
  const [setting, outputGood] = getBuildingSettingByGood(delta.good, settings);
  // if no possible building is found for an excess good, return the chain as is
  if (!setting || !outputGood) {
    return buildingChain;
  }
  const requiredGoodAmount = delta.amount * -1;

  const totalBuildingRequired = Math.ceil(requiredGoodAmount / outputGood.amount);

  // update the chain
  // check for existing building in chain
  const existingBuilding = buildingChain.find((building) => building.name === setting.name);
  // calculate new quantity
  const totalQuantity = existingBuilding ? existingBuilding.quantity + totalBuildingRequired : totalBuildingRequired;

  // calculate new building outputs and inputs per quantity
  const totalNewBuildingsOutputs = getTotalSettingOutputPerBuilding(setting as BuildingSetting).map((output) => {
    return { ...output, ...{ amount: output.amount * totalQuantity } };
  });
  const totalNewBuildingInputs = getTotalSettingInputPerBuilding(setting as BuildingSetting).map((input) => {
    return { ...input, ...{ amount: input.amount * totalQuantity } };
  });

  // remove the existing building from the chain to avoid duplicates
  const filteredChain = buildingChain.filter((building) => building.name !== setting.name);

  // add updated building to the chain
  const updatedBuilding = {
    name: setting.name,
    requiredTechs: existingBuilding?.requiredTechs || getSettingRequiredTechs(setting) || [],
    quantity: totalQuantity,
    totalInputs: totalNewBuildingInputs,
    totalOutputs: totalNewBuildingsOutputs,
  };
  const updatedChain = [...filteredChain, updatedBuilding];

  // repeat the process until all negative deltas are resolved
  return recursiveCalculateBuildingChain(updatedChain, settings);
};

const calculateBuildingChain = (selectedBuilding: Building, quantity: number, settings: BuildingSetting[]) => {
  const selectedBuildingSetting = settings.find((s) => s.name === selectedBuilding.name) as BuildingSetting;
  let baseInputs = getTotalSettingInputPerBuilding(selectedBuildingSetting).map((input) => {
    return { ...input, amount: (input.amount = input.amount * quantity) };
  });
  let baseOutputs = getTotalSettingOutputPerBuilding(selectedBuildingSetting).map((output) => {
    return { ...output, amount: (output.amount = output.amount * quantity) };
  });
  const buildingChain: BuildingChain[] = [];

  buildingChain.push({
    name: selectedBuildingSetting.name,
    requiredTechs: getSettingRequiredTechs(selectedBuildingSetting),
    quantity,
    totalInputs: baseInputs,
    totalOutputs: baseOutputs,
  });

  return recursiveCalculateBuildingChain(buildingChain, settings);
};

export {
  getTotalSettingInputPerBuilding,
  getTotalSettingOutputPerBuilding,
  getBuildingSettingByGood,
  calculateBuildingChainInputs,
  calculateBuildingChainOutputs,
  calculateBuildingChainDeltas,
  recursiveCalculateBuildingChain,
  calculateBuildingChain,
  getSettingRequiredTechs,
};
