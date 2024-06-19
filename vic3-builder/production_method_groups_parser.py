import os
import json
from pdx_text_line_cleaner import PdxTextLineCleaner

class ProductionMethodGroupsParser:
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.is_production_methods_open = False

    def parse(self):
        building_district_list = []
        for filename in os.listdir(self.folder_path):
            if filename.endswith(".txt"):  # Check file extension
                print(f"Parsing file: {filename}")
                with open(os.path.join(self.folder_path, filename), "r") as file:  # Open file
                    lines = file.readlines()

                    cleaner = PdxTextLineCleaner(lines)
                    building_district_list += cleaner.clean(self.callback)

                    file.close()
        with open(os.path.join(self.folder_path, 'production_method_groups.json'), 'w') as json_file:
            json.dump(building_district_list, json_file)

        return building_district_list

    def callback(self, line, item_dict):
        item_dict = self.handleUnlockingTechnologies(line, item_dict)
        return item_dict

    def handleUnlockingTechnologies(self, line, item_dict):
        isHeaderInLine = "production_methods" in line
        if isHeaderInLine and self.is_production_methods_open == False:
            item_dict["production_methods"] = []
            self.is_production_methods_open = True

        if self.is_production_methods_open and isHeaderInLine != True:
            if "}" in line:
                self.is_production_methods_open = False
            else:
                item_dict["production_methods"].append(line)

        return item_dict