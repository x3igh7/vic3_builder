import Building from '@/interfaces/building';
import BuildingSetting from '@/interfaces/building-setting';
import ProductionResult from '@/interfaces/production-result';
import BuildingChain from '@/interfaces/building-chain';

const sortChainsByTotalRequiredBuildings = (buildingChains: BuildingChain[][]) => {
  return buildingChains.sort((a, b) => {
    const totalRequiredBuildingsA = a.reduce((acc, building) => {
      return acc + building.quantity;
    }, 0);
    const totalRequiredBuildingsB = b.reduce((acc, building) => {
      return acc + building.quantity;
    }, 0);

    return totalRequiredBuildingsA - totalRequiredBuildingsB;
  });
};

const getTotalSettingInputPerBuilding = (setting: BuildingSetting) => {
  return setting.production_method_groups
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
  return setting.production_method_groups
    .flatMap((group) => {
      if (!group.currentMethod.outputs) {
        return [];
      }
      return group.currentMethod.outputs.map((output) => output);
    })
    .reduce<ProductionResult[]>((acc, output) => {
      if (acc.some((a) => a.good === output.good)) {
        const updated = acc.map((a) => {
          let amount = a.amount;
          if (a.good === output.good) {
            amount += output.amount;
          }
          return {
            ...a,
            amount: amount,
          };
        });

        return [...updated];
      }

      return [...acc, output];
    }, []);
};

const getBuildingSettingsByGood = (good: string, settings: BuildingSetting[]): BuildingSetting[] => {
  return settings.filter((s) =>
    s.production_method_groups.some((g) => g.currentMethod.outputs?.some((o) => o.good === good)),
  );
};

const getOutputGoodFromSetting = (setting: BuildingSetting, good: string) => {
  const potentialMethodsGroups = setting.production_method_groups.filter((g) =>
    g.currentMethod.outputs?.some((o) => o.good === good),
  );
  const totalGoodOutput = potentialMethodsGroups.reduce((outputTotal, group) => {
    const methodOutput =
      group.currentMethod.outputs?.reduce((acc, output) => {
        if (output.good === good) {
          return acc + output.amount;
        }
        return acc;
      }, 0) || 0;

    return outputTotal + methodOutput;
  }, 0);

  return { good, amount: totalGoodOutput };
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

const calculateBuildingChainInputDeltas = (buildingChain: BuildingChain[]): ProductionResult[] => {
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
  const productionTechs = setting.production_method_groups?.flatMap(
    (group) => group.currentMethod?.unlocking_technologies || [],
  );
  return [...buildingTechs, ...productionTechs];
};

const getActiveChains = (buildingChains: BuildingChain[][]) => {
  return buildingChains.filter((bc) => {
    const totalChainDeltas = calculateBuildingChainInputDeltas(bc);
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
    displayName: setting.displayName,
    requiredTechs: existingBuilding?.requiredTechs || getSettingRequiredTechs(setting) || [],
    quantity: totalQuantity,
    totalInputs: totalNewBuildingInputs,
    totalOutputs: totalNewBuildingsOutputs,
  };
};

const recursiveCalculateBuildingChain = (
  buildingChains: BuildingChain[][],
  settings: BuildingSetting[],
): BuildingChain[][] => {
  const activeChains = getActiveChains(buildingChains);
  if (!activeChains.length) {
    return buildingChains;
  }

  // start with the first active chain
  const buildingChain = activeChains[0];

  // remove the active chain from the list
  const filteredBuildingChains = buildingChains.filter((bc) => bc !== buildingChain);

  const totalChainDeltas = calculateBuildingChainInputDeltas(buildingChain);
  const negativeDeltas = totalChainDeltas.filter((delta) => delta.amount < 0);

  if (!negativeDeltas.length) {
    return buildingChains;
  }

  const delta = negativeDeltas[0];

  // find the building(s) that produce the good
  const possibleSettings = getBuildingSettingsByGood(delta.good, settings);

  // if no possible building is found, return the chain as is
  if (!possibleSettings.length) {
    return buildingChains;
  }

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
      // if there's already a chain with this building then skip
      if (buildingChains.some((bc) => bc.some((b) => b.name === setting.name))) {
        return;
      }

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

const calculateBuildingChains = (selectedBuilding: Building, quantity: number, settings: BuildingSetting[]) => {
  const selectedBuildingSetting = { ...(settings.find((s) => s.name === selectedBuilding.name) as BuildingSetting) };
  let baseInputs = getTotalSettingInputPerBuilding(selectedBuildingSetting).map((input) => {
    const updatedAmount = input.amount * quantity;
    return { ...input, amount: updatedAmount };
  });
  let baseOutputs = getTotalSettingOutputPerBuilding(selectedBuildingSetting).map((output) => {
    const updatedAmount = output.amount * quantity;
    return { ...output, amount: updatedAmount };
  });
  const buildingChain: BuildingChain[] = [];

  buildingChain.push({
    name: selectedBuildingSetting.name,
    displayName: selectedBuildingSetting.displayName,
    requiredTechs: getSettingRequiredTechs(selectedBuildingSetting),
    quantity,
    totalInputs: baseInputs,
    totalOutputs: baseOutputs,
  });

  return recursiveCalculateBuildingChain([buildingChain], settings);
};

export {
  sortChainsByTotalRequiredBuildings,
  getTotalSettingInputPerBuilding,
  getTotalSettingOutputPerBuilding,
  getBuildingSettingsByGood,
  calculateBuildingChainInputs,
  calculateBuildingChainOutputs,
  calculateBuildingChainInputDeltas,
  recursiveCalculateBuildingChain,
  calculateBuildingChains,
  getSettingRequiredTechs,
  getOutputGoodFromSetting,
  getUpdatedBuilding,
};
