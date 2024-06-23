import BuildingSetting from '@/interfaces/building-setting';
import {
  calculateBuildingChainDeltas,
  calculateBuildingChainInputs,
  calculateBuildingChainOutputs,
  getBuildingSettingByGood,
  getTotalSettingInputPerBuilding,
  getTotalSettingOutputPerBuilding,
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
    it('should return the correct setting and output good', () => {
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
      ];

      const [setting, outputGood] = getBuildingSettingByGood('Good 3', settings);

      expect(setting?.name).toEqual('Test Building 2');
      expect(outputGood?.good).toEqual('Good 3');
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

      const result = recursiveCalculateBuildingChain(chain, settings);
      expect(result.length).toEqual(2);
      const building2 = result.find((r) => r.name === 'Test Building 2') as BuildingChain;
      expect(building2.quantity).toEqual(5);
    });
  });
});
