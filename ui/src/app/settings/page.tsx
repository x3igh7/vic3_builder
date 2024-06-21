"use client"

import {ReactElement, useEffect, useState,} from "react";
import {useLocalStorage} from "primereact/hooks";
import BuildingSetting from "@/interfaces/building_setting";
import ProductionMethodGroup from "@/interfaces/production-method-group";
import ProductionMethod from "@/interfaces/production_method";
import Building from "@/interfaces/building";

const SettingsPage = (): ReactElement => {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [productionMethodGroups, setProductionMethodGroups] = useState<ProductionMethodGroup[]>([]);
    const [productionMethods, setProductionMethods] = useState<ProductionMethod[]>([]);
    const [settings, setSettings] = useLocalStorage<BuildingSetting[]>([], 'settings');

    useEffect(() => {
        fetch('data/buildings.json')
            .then(response => response.json())
            .then(data => setBuildings(data));

        fetch('data/production-method-groups.json')
            .then(response => response.json())
            .then(data => setProductionMethodGroups(data));

        fetch('data/production-methods.json')
            .then(response => response.json())
            .then(data => setProductionMethods(data));
    }, []);

    useEffect(() => {
        // set up default settings if none are saved
        if(settings.length === 0) {
            if(buildings.length && productionMethodGroups.length && productionMethods.length) {
                const defaultSettings = buildings.map(building => {
                    return {
                        name: building.name,
                        productionMethodGroups: productionMethodGroups.filter(group => building.production_method_groups.includes(group.name)).map(group => {
                            return {
                                name: group.name,
                                currentMethod: productionMethods.find(method => group.production_methods[0] === method.name)?.name
                            }
                        })
                    }
                })
            }
        }
    }, [settings, buildings, productionMethodGroups, productionMethods]);

    return (<h1>Test</h1>)
}

export default SettingsPage;