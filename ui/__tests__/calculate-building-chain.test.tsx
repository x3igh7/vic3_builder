import BuildingSetting from '@/interfaces/building-setting';
import {
  calculateBuildingChainInputDeltas,
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
        displayName: 'Test Display',
        production_method_groups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              displayName: 'Test Method Display',
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
              displayName: 'Test Method Display',

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
        displayName: 'Test Display',
        production_method_groups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              displayName: 'Test Method Display',
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
              displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'Test Group',
              currentMethod: {
                name: 'Test Method',
                displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'Test Group 2',
              currentMethod: {
                name: 'Test Method 2',
                displayName: 'Test Method Display',
                outputs: [{ good: 'Good 3', amount: 3 }],
              },
            },
          ],
        },
        {
          name: 'Test Building 3',
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'Test Group 2',
              currentMethod: {
                name: 'Test Method 2',
                displayName: 'Test Method Display',
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
        displayName: 'Test Building Display',
        production_method_groups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 3 }],
        },
        {
          name: 'Test Building 2',
          displayName: 'Test Building Display',
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
          displayName: 'Test Building Display',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 3 }],
        },
        {
          name: 'Test Building 2',
          displayName: 'Test Building Display',
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
          displayName: 'Test Building Display',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 2', amount: 2 },
          ],
          totalOutputs: [{ good: 'Good 3', amount: 4 }],
        },
        {
          name: 'Test Building 2',
          displayName: 'Test Building Display',
          quantity: 1,
          totalInputs: [
            { good: 'Good 1', amount: 1 },
            { good: 'Good 3', amount: 3 },
          ],
          totalOutputs: [{ good: 'Good 2', amount: 2 }],
        },
      ];

      const result = calculateBuildingChainInputDeltas(chain);
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
        displayName: 'Test Building Display',
        production_method_groups: [
          {
            name: 'Test Group',
            currentMethod: {
              name: 'Test Method',
              displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          quantity: 10,
          totalInputs: [{ good: 'Good 1', amount: 10 }],
          totalOutputs: [],
        },
      ];

      const settings = [
        {
          name: 'Test Building',
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'Test Group',
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'Test Method',
                displayName: 'Test Method Display',
                inputs: [{ good: 'Good 1', amount: 1 }],
              },
            },
          ],
        },
        {
          name: 'Test Building 2',
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'Test Group 2',
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'Test Method 2',
                displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_construction_sector',
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'pm_wooden_buildings',
                displayName: 'Test Method Display',
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
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_cotton_plantation',
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'default_building_cotton_plantation',
                displayName: 'Test Method Display',
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
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Method Display',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation',
              displayName: 'Test Group Display',
              currentMethod: {
                name: 'pm_privately_owned_plantation',
                displayName: 'Test Method Display',
              },
            },
          ],
        },
        {
          name: 'building_logging_camp',
          displayName: 'Test Building Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_saw_mills',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_hardwood',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_equipment',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_equipment',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_transportation_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_capital_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_merchant_guilds_building_logging_camp',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_tooling_workshops',
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_tooling_workshops',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_crude_tools',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_automation_disabled',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_capital_building_tooling_workshops',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_merchant_guilds_building_tooling_workshops',
                displayName: 'Test Display',
              },
            },
          ],
        },
      ];

      const selectedBuilding = {
        name: 'building_construction_sector',
        displayName: 'Test Building Display',
        unlocking_technologies: ['urbanization'],
        production_method_groups: ['pmg_base_building_construction_sector'],
        required_construction: 200,
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

    it('should handle multiple production methods that output goods', () => {
      const settings = [
        {
          name: 'building_arms_industry',
          displayName: 'Test Display',
          unlocking_technologies: ['gunsmithing'],
          production_method_groups: [
            {
              name: 'pmg_firearms_manufacturing',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_muskets',
                displayName: 'Test Display',
                inputs: [
                  {
                    good: 'iron',
                    amount: 10,
                  },
                  {
                    good: 'hardwood',
                    amount: 10,
                  },
                ],
                outputs: [
                  {
                    good: 'small_arms',
                    amount: 30,
                  },
                ],
              },
            },
            {
              name: 'pmg_automation_building_arms_industry',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_automation_disabled',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_iron_mine',
          displayName: 'Test Display',
          unlocking_technologies: ['shaft_mining'],
          production_method_groups: [
            {
              name: 'pmg_mining_equipment_building_iron_mine',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_picks_and_shovels_building_iron_mine',
                displayName: 'Test Display',
                inputs: [
                  {
                    good: 'tools',
                    amount: 5,
                  },
                ],
                outputs: [
                  {
                    good: 'iron',
                    amount: 20,
                  },
                ],
              },
            },
            {
              name: 'pmg_explosives_building_iron_mine',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_explosives',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_steam_automation_building_iron_mine',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_steam_automation',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_train_automation_building_iron_mine',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_logging_camp',
          displayName: 'Test Display',
          unlocking_technologies: [],
          production_method_groups: [
            {
              name: 'pmg_base_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_simple_forestry',
                displayName: 'Test Display',
                inputs: [],
                outputs: [
                  {
                    good: 'wood',
                    amount: 30,
                  },
                ],
              },
            },
            {
              name: 'pmg_hardwood',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_hardwood',
                displayName: 'Test Display',
                inputs: [],
                outputs: [
                  {
                    good: 'wood',
                    amount: -25,
                  },
                  {
                    good: 'hardwood',
                    amount: 10,
                  },
                ],
              },
            },
            {
              name: 'pmg_equipment',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_equipment',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_transportation_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_tooling_workshops',
          displayName: 'Test Display',
          unlocking_technologies: ['manufacturies'],
          production_method_groups: [
            {
              name: 'pmg_base_building_tooling_workshops',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_crude_tools',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_automation_disabled',
                displayName: 'Test Display',
              },
            },
          ],
        },
      ];

      const selectedBuilding = {
        name: 'building_arms_industry',
        displayName: 'Test Display',
        unlocking_technologies: ['gunsmithing'],
        production_method_groups: [
          'pmg_firearms_manufacturing',
          'pmg_automation_building_arms_industry',
          'pmg_ownership_capital_building_arms_industry',
        ],
        required_construction: 200,
      };

      const results = calculateBuildingChains(selectedBuilding, 5, settings);

      expect(results.length).toEqual(1);
      expect(results[0].find((bc) => bc.name === 'building_arms_industry')?.quantity).toEqual(5);
      expect(results[0].find((bc) => bc.name === 'building_iron_mine')?.quantity).toEqual(3);
      expect(results[0].find((bc) => bc.name === 'building_tooling_workshops')?.quantity).toEqual(1);
      expect(results[0].find((bc) => bc.name === 'building_logging_camp')?.quantity).toEqual(6);
    });

    it('should calculate multiple possible building chains if multiple buildings produce the same good', () => {
      const settings = [
        {
          name: 'building_construction_sector',
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_construction_sector',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_wooden_buildings',
                displayName: 'Test Display',
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
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_cotton_plantation',
              displayName: 'Test Display',
              currentMethod: {
                name: 'default_building_cotton_plantation',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_privately_owned_plantation',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_cotton_plantation_small',
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_cotton_plantation_small',
              displayName: 'Test Display',
              currentMethod: {
                name: 'default_building_cotton_plantation_small',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts_small',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_land_building_cotton_plantation_small',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_privately_owned_plantation_small',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_logging_camp',
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_saw_mills',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_hardwood',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_equipment',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_no_equipment',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_transportation_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_road_carts',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_capital_building_logging_camp',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_merchant_guilds_building_logging_camp',
                displayName: 'Test Display',
              },
            },
          ],
        },
        {
          name: 'building_tooling_workshops',
          displayName: 'Test Display',
          production_method_groups: [
            {
              name: 'pmg_base_building_tooling_workshops',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_crude_tools',
                displayName: 'Test Display',
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
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_automation_disabled',
                displayName: 'Test Display',
              },
            },
            {
              name: 'pmg_ownership_capital_building_tooling_workshops',
              displayName: 'Test Display',
              currentMethod: {
                name: 'pm_merchant_guilds_building_tooling_workshops',
                displayName: 'Test Display',
              },
            },
          ],
        },
      ];

      const selectedBuilding = {
        name: 'building_construction_sector',
        displayName: 'Test Display',
        unlocking_technologies: ['urbanization'],
        production_method_groups: ['pmg_base_building_construction_sector'],
        required_construction: 200,
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
