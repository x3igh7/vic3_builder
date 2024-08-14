// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals';
import { calculateBuildingEfficiency, getInputsValue, getOutputsValue } from '@/utils/calculate-building-efficiency';

describe('calculateBuildingEfficiency', () => {
  const goods = [
    {
      name: 'wood',
      displayName: 'Wood',
      cost: 20,
    },
    {
      name: 'hardwood',
      displayName: 'Hardwood',
      cost: 40,
    },
    {
      name: 'tools',
      displayName: 'Tools',
      cost: 40,
    },
    {
      name: 'fruit',
      displayName: 'Fruit',
      cost: 30,
    },
  ];

  const buildings = [
    {
      name: 'building_banana_plantation',
      displayName: 'Banana Plantation',
      required_construction: 200,
      unlocking_technologies: ['enclosure'],
      production_method_groups: [
        'pmg_base_building_banana_plantation',
        'pmg_train_automation_building_banana_plantation',
      ],
    },
  ];

  describe('getInputsValue', () => {
    it('should return the total value of inputs', () => {
      const setting = {
        name: 'building_logging_camp',
        displayName: 'Logging Camps',
        unlocking_technologies: [],
        production_method_groups: [
          {
            name: 'pmg_base_building_logging_camp',
            displayName: 'Base',
            currentMethod: {
              name: 'pm_saw_mills',
              displayName: 'Saw Mills',
              unlocking_technologies: ['steelworking'],
              inputs: [
                {
                  good: 'tools',
                  amount: 5.0,
                },
              ],
              outputs: [
                {
                  good: 'wood',
                  amount: 60.0,
                },
              ],
            },
          },
          {
            name: 'pmg_hardwood',
            displayName: 'Hardwood Production',
            currentMethod: {
              name: 'pm_hardwood',
              displayName: 'Hardwood',
              inputs: [],
              outputs: [
                {
                  good: 'wood',
                  amount: -25.0,
                },
                {
                  good: 'hardwood',
                  amount: 10.0,
                },
              ],
            },
          },
          {
            name: 'pmg_equipment',
            displayName: 'Special Equipment',
            currentMethod: {
              name: 'pm_no_equipment',
              displayName: 'Horse Drawn',
            },
          },
          {
            name: 'pmg_transportation_building_logging_camp',
            displayName: 'Transportation',
            currentMethod: {
              name: 'pm_road_carts',
              displayName: 'Road Carts',
            },
          },
        ],
      };

      const result = getInputsValue(setting, goods);

      expect(result).toBe(200);
    });
  });

  describe('getOutputsValue', () => {
    it('should return the total value of the outputs', () => {
      const setting = {
        name: 'building_logging_camp',
        displayName: 'Logging Camps',
        unlocking_technologies: [],
        production_method_groups: [
          {
            name: 'pmg_base_building_logging_camp',
            displayName: 'Base',
            currentMethod: {
              name: 'pm_saw_mills',
              displayName: 'Saw Mills',
              unlocking_technologies: ['steelworking'],
              inputs: [
                {
                  good: 'tools',
                  amount: 5.0,
                },
              ],
              outputs: [
                {
                  good: 'wood',
                  amount: 60.0,
                },
              ],
            },
          },
          {
            name: 'pmg_hardwood',
            displayName: 'Hardwood Production',
            currentMethod: {
              name: 'pm_hardwood',
              displayName: 'Hardwood',
              inputs: [],
              outputs: [
                {
                  good: 'wood',
                  amount: -25.0,
                },
                {
                  good: 'hardwood',
                  amount: 10.0,
                },
              ],
            },
          },
          {
            name: 'pmg_equipment',
            displayName: 'Special Equipment',
            currentMethod: {
              name: 'pm_no_equipment',
              displayName: 'Horse Drawn',
            },
          },
          {
            name: 'pmg_transportation_building_logging_camp',
            displayName: 'Transportation',
            currentMethod: {
              name: 'pm_road_carts',
              displayName: 'Road Carts',
            },
          },
        ],
      };

      const result = getOutputsValue(setting, goods);

      expect(result).toBe(1100);
    });

    it('should return the output value of banana plantations', () => {
      const setting = {
        name: 'building_banana_plantation',
        displayName: 'Banana Plantations',
        unlocking_technologies: ['enclosure'],
        production_method_groups: [
          {
            name: 'pmg_base_building_banana_plantation',
            displayName: 'Base',
            currentMethod: {
              name: 'default_building_banana_plantation',
              inputs: [],
              outputs: [
                {
                  good: 'fruit',
                  amount: 30,
                },
              ],
              displayName: 'Basic Production',
            },
          },
          {
            name: 'pmg_train_automation_building_banana_plantation',
            displayName: 'Train Automation',
            currentMethod: {
              name: 'pm_road_carts',
              displayName: 'Road Carts',
            },
          },
        ],
      };

      const result = getOutputsValue(setting, goods);

      expect(result).toBe(900);
    });
  });

  describe('calculateBuildingEfficiency', () => {
    it('should return the building efficiency for a building', () => {
      const setting = {
        name: 'building_banana_plantation',
        displayName: 'Banana Plantations',
        unlocking_technologies: ['enclosure'],
        production_method_groups: [
          {
            name: 'pmg_base_building_banana_plantation',
            displayName: 'Base',
            currentMethod: {
              name: 'default_building_banana_plantation',
              inputs: [],
              outputs: [
                {
                  good: 'fruit',
                  amount: 30,
                },
              ],
              displayName: 'Basic Production',
            },
          },
          {
            name: 'pmg_train_automation_building_banana_plantation',
            displayName: 'Train Automation',
            currentMethod: {
              name: 'pm_road_carts',
              displayName: 'Road Carts',
            },
          },
        ],
      };

      const result = calculateBuildingEfficiency(setting, goods, buildings);

      expect(result.constructionEfficiency).toBeDefined();
      expect(result.priceFlexibility).toBeDefined();
      expect(result.netValue).toBeDefined();
    });
  });
});
