import os
import json
from pdx_text_line_cleaner import PdxTextLineCleaner

class BuildingsParser:
    def __init__(self, folder_path, output_path):
        self.folder_path = folder_path
        self.output_path = output_path
        self.is_unlocking_technologies_open = False
        self.is_production_method_groups_open = False

    def parse(self):
        building_district_list = []
        for filename in os.listdir(self.folder_path):
            if filename.endswith(".txt"):  # Check file extension
                print(f"Parsing file: {filename}")
                with open(os.path.join(self.folder_path, filename), "r") as file:  # Open file
                    lines = file.readlines()

                    cleaner = PdxTextLineCleaner(lines)
                    results = cleaner.clean(self.callback)
                    self.remove_duplicates_and_add_to_list(building_district_list, results)

                    file.close()
        with open(os.path.join(self.output_path, 'buildings.json'), 'w') as json_file:
            json.dump(building_district_list, json_file)

        return building_district_list

    def callback(self, line, item_dict):
        item_dict = self.handleUnlockingTechnologies(line, item_dict)
        item_dict = self.handleProductionMethodGroups(line, item_dict)
        return item_dict

    def handleUnlockingTechnologies(self, line, item_dict):
        isHeaderInLine = "unlocking_technologies" in line
        if isHeaderInLine and self.is_unlocking_technologies_open == False:
            item_dict["unlocking_technologies"] = []
            self.is_unlocking_technologies_open = True

        if self.is_unlocking_technologies_open and isHeaderInLine != True:
            if "}" in line:
                self.is_unlocking_technologies_open = False
            else:
                item_dict["unlocking_technologies"].append(line)

        return item_dict

    def handleProductionMethodGroups(self, line, item_dict):
        isHeaderInLine = "production_method_groups" in line
        if isHeaderInLine and self.is_production_method_groups_open == False:
            item_dict["production_method_groups"] = []
            self.is_production_method_groups_open = True

        if self.is_production_method_groups_open and not isHeaderInLine:
            if "}" in line:
                self.is_production_method_groups_open = False
            else:
                item_dict["production_method_groups"].append(line)

        return item_dict

    def remove_duplicates_and_add_to_list(self, buildings_list, file_list):
        for new_item in file_list:
            is_unique = True
            # Check if item already exists in list
            for building in buildings_list:
                if building["name"] == new_item["name"]:
                    is_unique = False

            # if unique add to list
            if is_unique:
                buildings_list.append(new_item)
            # Reset is_unique
            is_unique = True


        return buildings_list