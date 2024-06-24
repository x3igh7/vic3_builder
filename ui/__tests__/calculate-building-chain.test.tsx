import BuildingSetting from '@/interfaces/building-setting';
import {
  calculateBuildingChainDeltas,
  calculateBuildingChainInputs,
  calculateBuildingChainOutputs,
  calculateBuildingChains,
  getBuildingSettingsByGood,
  getOutputGoodFromSetting,
  getTotalSettingInputPerBuilding,
  getTotalSettingOutputPerBuilding,
  getUpdatedBuilding,
  recursiveCalculateBuildingChain,
} from '@/utils/calculate-building-chain';
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals';
import BuildingChain from '@/interfaces/building-chain';

describe('calculateBuildingChain functions', () => {
  describe('getTotalSettingInputPerBuilding', () => {
    it('should return the total amount per good for all inputs', () => {
      const setting: BuildingSetting = {
        name: 'Test Building',
        productionMethodGroups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              inputs: [
                { good: 'Good 1', amount: 1 },
                { good: 'Good 2', amount: 2 },
              ],
            },
          },
          {
            name: 'Test Group 2',
            currentMethod: {
              name: 'Test Method 2',
              inputs: [
                { good: 'Good 1', amount: 1 },
                { good: 'Good 3', amount: 3 },
              ],
            },
          },
        ],
      };

      const result = getTotalSettingInputPerBuilding(setting);
      const good1 = result.find((r) => r.good === 'Good 1');
      const good2 = result.find((r) => r.good === 'Good 2');
      const good3 = result.find((r) => r.good === 'Good 3');

      expect(good1?.amount).toEqual(2);
      expect(good2?.amount).toEqual(2);
      expect(good3?.amount).toEqual(3);
    });
  });

  describe('getTotalSettingOutputPerBuilding', () => {
    it('should return the total amount per good for all inputs', () => {
      const setting: BuildingSetting = {
        name: 'Test Building',
        productionMethodGroups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              outputs: [
                { good: 'Good 1', amount: 1 },
                { good: 'Good 2', amount: 2 },
              ],
            },
          },
          {
            name: 'Test Group 2',
            currentMethod: {
              name: 'Test Method 2',
              outputs: [
                { good: 'Good 1', amount: 1 },
                { good: 'Good 3', amount: 3 },
              ],
            },
          },
        ],
      };

      const result = getTotalSettingOutputPerBuilding(setting);
      const good1 = result.find((r) => r.good === 'Good 1');
      const good2 = result.find((r) => r.good === 'Good 2');
      const good3 = result.find((r) => r.good === 'Good 3');

      expect(good1?.amount).toEqual(2);
      expect(good2?.amount).toEqual(2);
      expect(good3?.amount).toEqual(3);
    });
  });

  describe('getBuildingSettingByGood', () => {
    it('should return the correct settings', () => {
      const settings: BuildingSetting[] = [
        {
          name: 'Test Building',
          productionMethodGroups: [
            {
              name: 'Test Group',
              currentMethod: {
                name: 'Test Method',
                outputs: [
                  { good: 'Good 1', amount: 1 },
                  { good: 'Good 2', amount: 2 },
                ],
              },
            },
          ],
        },
        {
          name: 'Test Building 2',
          productionMethodGroups: [
            {
              name: 'Test Group 2',
              currentMethod: {
                name: 'Test Method 2',
                outputs: [{ good: 'Good 3', amount: 3 }],
              },
            },
          ],
        },
        {
          name: 'Test Building 3',
          productionMethodGroups: [
            {
              name: 'Test Group 2',
              currentMethod: {
                name: 'Test Method 2',
                outputs: [{ good: 'Good 3', amount: 1 }],
              },
            },
          ],
        },
      ];

      const result = getBuildingSettingsByGood('Good 3', settings);

      expect(result.some((r) => r.name === 'Test Building 2')).toBeTruthy();
      expect(result.some((r) => r.name === 'Test Building 3')).toBeTruthy();
    });
  });

  describe('getOutputGoodFromSetting', () => {
    it('should return the specified output good production result from a setting', () => {
      const setting: BuildingSetting = {
        name: 'Test Building',
        productionMethodGroups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              outputs: [
                { good: 'Good 1', amount: 1 },
                { good: 'Good 2', amount: 2 },
              ],
            },
          },
        ],
      };

      const result = getOutputGoodFromSetting(setting, 'Good 2');
      expect(result?.amount).toEqual(2);
    });
  });

  describe('calculateBuildingChainOutputs', () => {
    it('should return the total outputs all all buildings in the chain', () => {
      const chain: BuildingChain[] = [
        {
          name: 'Test Building',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 3 }],
        },
        {
          name: 'Test Building 2',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 3', amount: 3 },
          ],
          totalOutputs: [
            { good: 'Good 2', amount: 2 },
            { good: 'Good 3', amount: 3 },
          ],
        },
      ];

      const result = calculateBuildingChainOutputs(chain);
      const good1 = result.find((r) => r.good === 'Good 1');
      expect(good1?.amount).not.toBeDefined();
      const good2 = result.find((r) => r.good === 'Good 2');
      expect(good2?.amount).toEqual(2);
      const good3 = result.find((r) => r.good === 'Good 3');
      expect(good3?.amount).toEqual(6);
    });
  });

  describe('calculateBuildingChainInputs', () => {
    it('should return the total inputs all all buildings in the chain', () => {
      const chain: BuildingChain[] = [
        {
          name: 'Test Building',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 3 }],
        },
        {
          name: 'Test Building 2',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 3', amount: 3 },
          ],
          totalOutputs: [{ good: 'Good 2', amount: 2 }],
        },
      ];

      const result = calculateBuildingChainInputs(chain);
      const good1 = result.find((r) => r.good === 'Good 1');
      expect(good1?.amount).toEqual(2);
      const good2 = result.find((r) => r.good === 'Good 2');
      expect(good2?.amount).toEqual(2);
      const good3 = result.find((r) => r.good === 'Good 3');
      expect(good3?.amount).toEqual(3);
    });
  });

  describe('calculateBuildingChainDeltas', () => {
    it('should calculate the difference between the inputs and outputs', () => {
      const chain: BuildingChain[] = [
        {
          name: 'Test Building',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 4 }],
        },
        {
          name: 'Test Building 2',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 3', amount: 3 },
          ],
          totalOutputs: [{ good: 'Good 2', amount: 2 }],
        },
      ];

      const result = calculateBuildingChainDeltas(chain);
      const good1 = result.find((r) => r.good === 'Good 1');
      expect(good1?.amount).toEqual(-2);
      const good2 = result.find((r) => r.good === 'Good 2');
      expect(good2?.amount).toEqual(0);
      const good3 = result.find((r) => r.good === 'Good 3');
      expect(good3?.amount).toEqual(1);
    });
  });

  describe('getUpdatedBuilding', () => {
    it('should update the building quantity, inputs and outputs', () => {
      const delta = { good: 'Good 3', amount: -1 };
      const outputGood = { good: 'Good 3', amount: 3 };
      const buildingChain: BuildingChain[] = [];
      const setting: BuildingSetting = {
        name: 'Test Building 2',
        productionMethodGroups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              outputs: [{ good: 'Good 3', amount: 1 }],
            },
          },
        ],
      };

      const result = getUpdatedBuilding(delta, outputGood, buildingChain, setting);
      expect(result.quantity).toEqual(1);
      expect(result.totalOutputs[0].amount).toEqual(1);
    });
  });

  describe('recursiveCalculateBuildingChain', () => {
    it('should generate a building chain', () => {
      const chain: BuildingChain[] = [
        {
          name: 'Test Building',
          quantity: 10,
          totalInputs: [{ good: 'Good 1', amount: 10 }],
          totalOutputs: [],
        },
      ];

      const settings = [
        {
          name: 'Test Building',
          productionMethodGroups: [
            {
              name: 'Test Group',
              currentMethod: {
                name: 'Test Method',
                inputs: [{ good: 'Good 1', amount: 1 }],
              },
            },
          ],
        },
        {
          name: 'Test Building 2',
          productionMethodGroups: [
            {
              name: 'Test Group 2',
              currentMethod: {
                name: 'Test Method 2',
                inputs: [{ good: 'Good 2', amount: 1 }],
                outputs: [{ good: 'Good 1', amount: 2 }],
              },
            },
          ],
        },
      ];

      const results = recursiveCalculateBuildingChain([chain], settings);
      const result = results[0];
      expect(result.length).toEqual(2);
      const building2 = result.find((r) => r.name === 'Test Building 2') as BuildingChain;
      expect(building2.quantity).toEqual(5);
    });
  });

  describe('calculateBuildingChain', () => {
    it('should calculate the building chain for a building given a quantity', () => {
      const settings = [
        {
          name: 'building_construction_sector',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_construction_sector',
              currentMethod: {
                name: 'pm_wooden_buildings',
                inputs: [
                  {
                    good: 'fabric',
                    amount: 25,
                  },
                  {
                    good: 'wood',
                    amount: 75,
                  },
                ],
                outputs: [],
              },
            },
          ],
        },
        {
          name: 'building_cotton_plantation',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_cotton_plantation',
              currentMethod: {
                name: 'default_building_cotton_plantation',
                inputs: [],
                outputs: [
                  {
                    good: 'fabric',
                    amount: 40,
                  },
                ],
              },
            },
            {
              name: 'pmg_train_automation_building_cotton_plantation',
              currentMethod: {
                name: 'pm_road_carts',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation',
              currentMethod: {
                name: 'pm_privately_owned_plantation',
              },
            },
          ],
        },
        {
          name: 'building_logging_camp',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_logging_camp',
              currentMethod: {
                name: 'pm_saw_mills',
                unlocking_technologies: ['steelworking'],
                inputs: [
                  {
                    good: 'tools',
                    amount: 5,
                  },
                ],
                outputs: [
                  {
                    good: 'wood',
                    amount: 60,
                  },
                ],
              },
            },
            {
              name: 'pmg_hardwood',
              currentMethod: {
                name: 'pm_no_hardwood',
              },
            },
            {
              name: 'pmg_equipment',
              currentMethod: {
                name: 'pm_no_equipment',
              },
            },
            {
              name: 'pmg_transportation_building_logging_camp',
              currentMethod: {
                name: 'pm_road_carts',
              },
            },
            {
              name: 'pmg_ownership_capital_building_logging_camp',
              currentMethod: {
                name: 'pm_merchant_guilds_building_logging_camp',
              },
            },
          ],
        },
        {
          name: 'building_tooling_workshops',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_tooling_workshops',
              currentMethod: {
                name: 'pm_crude_tools',
                inputs: [
                  {
                    good: 'wood',
                    amount: 30,
                  },
                ],
                outputs: [
                  {
                    good: 'tools',
                    amount: 30,
                  },
                ],
              },
            },
            {
              name: 'pmg_automation_building_tooling_workshops',
              currentMethod: {
                name: 'pm_automation_disabled',
              },
            },
            {
              name: 'pmg_ownership_capital_building_tooling_workshops',
              currentMethod: {
                name: 'pm_merchant_guilds_building_tooling_workshops',
              },
            },
          ],
        },
      ];

      const selectedBuilding = {
        name: 'building_construction_sector',
        unlocking_technologies: ['urbanization'],
        production_method_groups: ['pmg_base_building_construction_sector'],
      };

      const results = calculateBuildingChains(selectedBuilding, 5, settings);
      const result = results[0];
      expect(result.length).toEqual(4);
      const buildingConstructionSector = result.find((r) => r.name === 'building_construction_sector') as BuildingChain;
      expect(buildingConstructionSector.quantity).toEqual(5);
      const loggingCamp = result.find((r) => r.name === 'building_logging_camp') as BuildingChain;
      expect(loggingCamp.quantity).toEqual(8);
      const toolingWorkshop = result.find((r) => r.name === 'building_tooling_workshops') as BuildingChain;
      expect(toolingWorkshop.quantity).toEqual(2);
      const cottonPlantation = result.find((r) => r.name === 'building_cotton_plantation') as BuildingChain;
      expect(cottonPlantation.quantity).toEqual(4);
    });

    it('should calculate multiple possible building chains if multiple buildings produce the same good', () => {
      const settings = [
        {
          name: 'building_construction_sector',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_construction_sector',
              currentMethod: {
                name: 'pm_wooden_buildings',
                inputs: [
                  {
                    good: 'fabric',
                    amount: 25,
                  },
                  {
                    good: 'wood',
                    amount: 75,
                  },
                ],
                outputs: [],
              },
            },
          ],
        },
        {
          name: 'building_cotton_plantation',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_cotton_plantation',
              currentMethod: {
                name: 'default_building_cotton_plantation',
                inputs: [],
                outputs: [
                  {
                    good: 'fabric',
                    amount: 40,
                  },
                ],
              },
            },
            {
              name: 'pmg_train_automation_building_cotton_plantation',
              currentMethod: {
                name: 'pm_road_carts',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation',
              currentMethod: {
                name: 'pm_privately_owned_plantation',
              },
            },
          ],
        },
        {
          name: 'building_cotton_plantation_small',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_cotton_plantation_small',
              currentMethod: {
                name: 'default_building_cotton_plantation_small',
                inputs: [],
                outputs: [
                  {
                    good: 'fabric',
                    amount: 20,
                  },
                ],
              },
            },
            {
              name: 'pmg_train_automation_building_cotton_plantation_small',
              currentMethod: {
                name: 'pm_road_carts_small',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation_small',
              currentMethod: {
                name: 'pm_privately_owned_plantation_small',
              },
            },
          ],
        },
        {
          name: 'building_logging_camp',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_logging_camp',
              currentMethod: {
                name: 'pm_saw_mills',
                unlocking_technologies: ['steelworking'],
                inputs: [
                  {
                    good: 'tools',
                    amount: 5,
                  },
                ],
                outputs: [
                  {
                    good: 'wood',
                    amount: 60,
                  },
                ],
              },
            },
            {
              name: 'pmg_hardwood',
              currentMethod: {
                name: 'pm_no_hardwood',
              },
            },
            {
              name: 'pmg_equipment',
              currentMethod: {
                name: 'pm_no_equipment',
              },
            },
            {
              name: 'pmg_transportation_building_logging_camp',
              currentMethod: {
                name: 'pm_road_carts',
              },
            },
            {
              name: 'pmg_ownership_capital_building_logging_camp',
              currentMethod: {
                name: 'pm_merchant_guilds_building_logging_camp',
              },
            },
          ],
        },
        {
          name: 'building_tooling_workshops',
          productionMethodGroups: [
            {
              name: 'pmg_base_building_tooling_workshops',
              currentMethod: {
                name: 'pm_crude_tools',
                inputs: [
                  {
                    good: 'wood',
                    amount: 30,
                  },
                ],
                outputs: [
                  {
                    good: 'tools',
                    amount: 30,
                  },
                ],
              },
            },
            {
              name: 'pmg_automation_building_tooling_workshops',
              currentMethod: {
                name: 'pm_automation_disabled',
              },
            },
            {
              name: 'pmg_ownership_capital_building_tooling_workshops',
              currentMethod: {
                name: 'pm_merchant_guilds_building_tooling_workshops',
              },
            },
          ],
        },
      ];

      const selectedBuilding = {
        name: 'building_construction_sector',
        unlocking_technologies: ['urbanization'],
        production_method_groups: ['pmg_base_building_construction_sector'],
      };

      const results = calculateBuildingChains(selectedBuilding, 5, settings);

      expect(results.length).toEqual(2);
      const buildingChain1 = results.find((r) => r.some((c) => c.name === 'building_cotton_plantation'));
      expect(buildingChain1?.find((bc) => bc.name === 'building_cotton_plantation')?.quantity).toEqual(4);

      const buildingChain2 = results.find((r) => r.some((c) => c.name === 'building_cotton_plantation_small'));
      expect(buildingChain2?.find((bc) => bc.name === 'building_cotton_plantation_small')?.quantity).toEqual(7);
    });
  });
});
