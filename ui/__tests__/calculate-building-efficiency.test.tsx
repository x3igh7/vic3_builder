// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals';
import { getInputsValue, getOutputsValue } from '@/utils/calculate-building-efficiency';

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
  });
});
