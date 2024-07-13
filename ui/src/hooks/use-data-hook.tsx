import { useEffect, useState } from 'react';
import ProductionMethod from '@/interfaces/production-method';
import Building from '@/interfaces/building';
import ProductionMethodGroup from '@/interfaces/production-method-group';

const useDataHook = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [productionMethodGroups, setProductionMethodGroups] = useState<ProductionMethodGroup[]>([]);
  const [productionMethods, setProductionMethods] = useState<ProductionMethod[]>([]);

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

  return { buildings, productionMethodGroups, productionMethods };
};

export default useDataHook;
