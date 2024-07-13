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
import ProductionMethod from '@/interfaces/production-method';
import useDebounce from '@/hooks/use-debounce';

const SettingsPage = (): ReactElement => {
  const { buildings, productionMethods, productionMethodGroups } = useDataHook();
  const [settings, setSettings] = useLocalStorage<BuildingSetting[]>([], 'settings_v2');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filteredSettings, setFilteredSettings] = useState<BuildingSetting[]>([]);

  const filterSettingsByQuery = () => {
    if (filterQuery.length) {
      return settings.filter((setting) => setting.name.toLowerCase().includes(filterQuery.toLowerCase()));
    }

    return settings;
  };

  const debouncedSetFilteredSettings = useDebounce(() => {
    setFilteredSettings(filterSettingsByQuery());
  });

  const getDefaultSettings = () => {
    return buildings
      .map((building) => {
        return {
          name: building.name,
          unlocking_technologies: building.unlocking_technologies || [],
          production_method_groups: productionMethodGroups
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

  useEffect(() => {
    debouncedSetFilteredSettings();
  }, [settings]);

  useEffect(() => {
    debouncedSetFilteredSettings();
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
