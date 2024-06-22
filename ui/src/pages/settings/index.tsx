import { ReactElement } from 'react';
import { useLocalStorage } from 'primereact/hooks';
import BuildingSetting from '@/interfaces/building-setting';
import Building from '@/interfaces/building';
import BuildingSettingItem from '@/components/building-setting-item';
import useDataHook from '@/hooks/use-data-hook';

const SettingsPage = (): ReactElement => {
  const { buildings, productionMethods, productionMethodGroups } = useDataHook();
  const [settings, setSettings] = useLocalStorage<BuildingSetting[]>([], 'settings');

  const handleSettingChange = (updatedSetting: BuildingSetting) => {
    const filteredSettings = settings.filter((setting) => setting.name !== updatedSetting.name);
    filteredSettings.push(updatedSetting);
    const sortedSettings = filteredSettings.sort((a, b) => a.name.localeCompare(b.name));
    setSettings(sortedSettings);
  };

  return (
    <div>
      <h1>Production Method Settings</h1>
      {settings.map((setting) => {
        const buildingItem = buildings.find((building) => building.name === setting.name);
        return (
          <BuildingSettingItem
            key={setting.name}
            building={buildingItem as Building}
            productionMethodGroups={productionMethodGroups}
            productionMethods={productionMethods}
            buildingSetting={setting}
            onSettingChange={handleSettingChange}
          />
        );
      })}
    </div>
  );
};

export default SettingsPage;
