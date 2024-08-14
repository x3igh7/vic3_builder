import { useEffect, useState } from 'react';
import ProductionMethod from '@/interfaces/production-method';
import Building from '@/interfaces/building';
import ProductionMethodGroup from '@/interfaces/production-method-group';
import { useTranslation } from 'react-i18next';
import Good from '@/interfaces/good';

const useDataHook = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [productionMethodGroups, setProductionMethodGroups] = useState<ProductionMethodGroup[]>([]);
  const [productionMethods, setProductionMethods] = useState<ProductionMethod[]>([]);
  const [goods, setGoods] = useState<Good[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('data/buildings.json')
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((building: Building) => {
          return {
            ...building,
            displayName: t(building.name),
          };
        });
        setBuildings(mappedData);
      });

    fetch('data/production_method_groups.json')
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((group: ProductionMethodGroup) => {
          return {
            ...group,
            displayName: t(group.name),
          };
        });
        setProductionMethodGroups(mappedData);
      });

    fetch('data/production_methods.json')
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((method: ProductionMethod) => {
          return {
            ...method,
            displayName: t(method.name),
          };
        });
        setProductionMethods(mappedData);
      });

    fetch('data/goods.json')
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((good: Good) => {
          return {
            ...good,
            displayName: t(good.name),
          };
        });
        setGoods(mappedData);
      });
  }, []);

  return { buildings, productionMethodGroups, productionMethods, goods };
};

export default useDataHook;
