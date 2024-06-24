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

const getBuildingSettingsByGood = (good: string, settings: BuildingSetting[]): BuildingSetting[] => {
  return settings.filter((s) =>
    s.productionMethodGroups.some((g) => g.currentMethod.outputs?.some((o) => o.good === good)),
  );
};

const getOutputGoodFromSetting = (setting: BuildingSetting, good: string) => {
  return setting.productionMethodGroups
    .find((g) => g.currentMethod.outputs?.some((o) => o.good === good))
    ?.currentMethod.outputs?.find((o) => o.good === good) as ProductionResult;
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

const calculateBuildingChainDeltas = (buildingChain: BuildingChain[]): ProductionResult[] => {
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

const getActiveChains = (buildingChains: BuildingChain[][]) => {
  return buildingChains.filter((bc) => {
    const totalChainDeltas = calculateBuildingChainDeltas(bc);
    const negativeDeltas = totalChainDeltas.filter((delta) => delta.amount < 0);

    // if there are no negative deltas, the chain is complete
    // otherwise return the chain, so it can be filled out
    if (negativeDeltas.length > 0) {
      return bc;
    }
  });
};

const getUpdatedBuilding = (
  delta: ProductionResult,
  outputGood: ProductionResult,
  buildingChain: BuildingChain[],
  setting: BuildingSetting,
) => {
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

  // add updated building to the chain
  return {
    name: setting.name,
    requiredTechs: existingBuilding?.requiredTechs || getSettingRequiredTechs(setting) || [],
    quantity: totalQuantity,
    totalInputs: totalNewBuildingInputs,
    totalOutputs: totalNewBuildingsOutputs,
  };
};

const recursiveCalculateBuildingChain = (buildingChains: BuildingChain[][], settings: BuildingSetting[]) => {
  const activeChains = getActiveChains(buildingChains);

  // start with the first active chain
  const buildingChain = activeChains[0];

  // remove the active chain from the list
  const filteredBuildingChains = buildingChains.filter((bc) => bc !== buildingChain);

  const totalChainDeltas = calculateBuildingChainDeltas(buildingChain);
  const negativeDeltas = totalChainDeltas.filter((delta) => delta.amount < 0);

  const delta = negativeDeltas[0];

  // find the building(s) that produce the good
  const possibleSettings = getBuildingSettingsByGood(delta.good, settings);

  // if a possible building already exists in the active chain, keep using it
  let preferredSetting = possibleSettings.find((s) => buildingChain.some((b) => b.name === s.name));
  if (!preferredSetting) {
    // start with the first option
    preferredSetting = possibleSettings[0];
  }

  // handle other options
  if (possibleSettings.length > 1) {
    const otherOptions = possibleSettings.filter((s) => s.name !== preferredSetting.name);
    otherOptions.forEach((setting) => {
      const otherSettingChain = buildingChain.map((building) => {
        return { ...building };
      });

      // create the building chain with the other setting
      const updatedBuilding = getUpdatedBuilding(
        delta,
        getOutputGoodFromSetting(setting, delta.good),
        otherSettingChain,
        setting,
      );

      // create an alternate chain and add it to the list
      filteredBuildingChains.push([...otherSettingChain, updatedBuilding]);
    });
  }

  const outputGood = getOutputGoodFromSetting(preferredSetting, delta.good);

  // if no possible building is found for an excess good, return the chain as is
  if (!preferredSetting || !outputGood) {
    return buildingChain;
  }

  // get the updated building
  const updatedBuilding = getUpdatedBuilding(delta, outputGood, buildingChain, preferredSetting);

  // remove the existing building from the chain to avoid duplicates
  const filteredChain = buildingChain.filter((building) => building.name !== updatedBuilding.name);

  // now update the chain with the new building
  const updatedChain = [...filteredChain, updatedBuilding];

  // add the updated chain back to the list of chains
  const result = [...filteredBuildingChains, updatedChain];

  // repeat the process until all negative deltas are resolved
  return recursiveCalculateBuildingChain(result, settings);
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

  return recursiveCalculateBuildingChain([buildingChain], settings);
};

export {
  getTotalSettingInputPerBuilding,
  getTotalSettingOutputPerBuilding,
  getBuildingSettingsByGood,
  calculateBuildingChainInputs,
  calculateBuildingChainOutputs,
  calculateBuildingChainDeltas,
  recursiveCalculateBuildingChain,
  calculateBuildingChain,
  getSettingRequiredTechs,
};
