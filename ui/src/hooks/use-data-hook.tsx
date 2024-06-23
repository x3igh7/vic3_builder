import { useEffect, useState } from 'react';
import ProductionMethod from '@/interfaces/production-method';
import Building from '@/interfaces/building';
import ProductionMethodGroup from '@/interfaces/production-method-group';
import { useLocalStorage } from 'primereact/hooks';
import BuildingSetting from '@/interfaces/building-setting';

const useDataHook = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [productionMethodGroups, setProductionMethodGroups] = useState<ProductionMethodGroup[]>([]);
  const [productionMethods, setProductionMethods] = useState<ProductionMethod[]>([]);
  const [settings, setSettings] = useLocalStorage<BuildingSetting[]>([], 'settings');

  useEffect(() => {
    fetch('data/buildings.json')
      .then((response) => response.json())
      .then((data) => setBuildings(data));

    fetch('data/production_method_groups.json')
      .then((response) => response.json())
      .then((data) => setProductionMethodGroups(data));

    fetch('data/production_methods.json')
      .then((response) => response.json())
      .then((data) => setProductionMethods(data));
  }, []);

  const getDefaultSettings = () => {
    return buildings
      .map((building) => {
        return {
          name: building.name,
          unlocking_technologies: building.unlocking_technologies || [],
          productionMethodGroups: productionMethodGroups
            .filter((group) => building.production_method_groups.includes(group.name))
            .map((group) => {
              const defaultMethod = productionMethods.find((method) => group.production_methods[0] === method.name);
              return {
                name: group.name,
                currentMethod: defaultMethod as ProductionMethod,
              };
            }),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  useEffect(() => {
    // set up default settings if none are saved
    if (settings.length === 0) {
      if (buildings.length && productionMethodGroups.length && productionMethods.length) {
        const defaultSettings = getDefaultSettings();
        setSettings(defaultSettings);
      }
    }
  }, [settings, buildings, productionMethodGroups, productionMethods]);

  return { buildings, productionMethodGroups, productionMethods, settings, getDefaultSettings };
};

export default useDataHook;
