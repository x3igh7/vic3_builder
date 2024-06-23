import { ReactElement, useEffect, useState } from 'react';
import { useLocalStorage } from 'primereact/hooks';
import BuildingSetting from '@/interfaces/building-setting';
import Building from '@/interfaces/building';
import BuildingSettingItem from '@/components/building-setting-item';
import useDataHook from '@/hooks/use-data-hook';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { css } from '@emotion/react';
import { Button } from 'primereact/button';

const SettingsPage = (): ReactElement => {
  const { buildings, productionMethods, productionMethodGroups, getDefaultSettings } = useDataHook();
  const [settings, setSettings] = useLocalStorage<BuildingSetting[]>([], 'settings');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filteredSettings, setFilteredSettings] = useState<BuildingSetting[]>([]);

  const filterSettingsByQuery = () => {
    return settings.filter((setting) => setting.name.toLowerCase().includes(filterQuery.toLowerCase()));
  };

  useEffect(() => {
    setFilteredSettings(filterSettingsByQuery());
  }, [settings]);

  useEffect(() => {
    setFilteredSettings(filterSettingsByQuery());
  }, [filterQuery]);

  const handleFilterQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== filterQuery) {
      setFilterQuery(e.target.value);
    }
  };

  const handleSettingChange = (updatedSetting: BuildingSetting) => {
    const filteredChangedSettings = settings.filter((setting) => setting.name !== updatedSetting.name);
    filteredChangedSettings.push(updatedSetting);
    const sortedSettings = filteredChangedSettings.sort((a, b) => a.name.localeCompare(b.name));
    setSettings(sortedSettings);
  };

  const handleResetSettings = () => {
    setSettings(getDefaultSettings());
  };

  const handleFilterCancelClick = () => {
    setFilterQuery('');
  };

  return (
    <div>
      <h1 css={css({ display: 'flex', alignContent: 'center' })}>
        <span>Production Method Settings</span>
        <Button
          icon="pi pi-undo"
          rounded
          text
          severity="warning"
          aria-label="Reset"
          tooltip={'Reset Settings to Default'}
          onClick={handleResetSettings}
        />
      </h1>
      <div css={css({ marginBottom: '3rem', display: 'flex' })}>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText value={filterQuery} placeholder="Search Buildings" onChange={handleFilterQueryChange} />
        </IconField>
        <Button
          icon="pi pi-times"
          severity="danger"
          aria-label="Cancel"
          disabled={!filterQuery}
          onClick={handleFilterCancelClick}
        />
      </div>
      {filteredSettings.map((setting) => {
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
