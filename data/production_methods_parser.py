import os
import json
from pdx_text_line_cleaner import PdxTextLineCleaner

class ProductionMethodsParser:
    def __init__(self, folder_path, output_path):
        self.folder_path = folder_path
        self.output_path = output_path
        self.is_unlocking_technologies_open = False
        self.is_building_modifiers_open = False
        self.is_workforce_scaled_open = False
        self.is_level_scaled_open = False

    def parse(self):
        item_list = []
        for filename in os.listdir(self.folder_path):
            if filename.endswith(".txt"):  # Check file extension
                print(f"Parsing file: {filename}")
                with open(os.path.join(self.folder_path, filename), "r") as file:  # Open file
                    lines = file.readlines()

                    cleaner = PdxTextLineCleaner(lines)
                    item_list += cleaner.clean(self.callback)

                    file.close()
        with open(os.path.join(self.output_path, 'production_methods.json'), 'w') as json_file:
            json.dump(item_list, json_file)

        return item_list

    def callback(self, line, item_dict):
        item_dict = self.handleUnlockingTechnologies(line, item_dict)
        if(self.is_unlocking_technologies_open == False):
            item_dict = self.handleBuildingModifiers(line, item_dict)
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

    def handleBuildingModifiers(self, line, item_dict):
        isHeaderInLine = "building_modifiers" in line
        if isHeaderInLine and self.is_building_modifiers_open == False:
            self.is_building_modifiers_open = True

        if self.is_building_modifiers_open and isHeaderInLine == False:
            self.handleWorkforceScaled(line, item_dict)

        if self.is_building_modifiers_open and self.is_workforce_scaled_open == False and isHeaderInLine != True:
            if "}" in line:
                self.is_building_modifiers_open = False

        return item_dict

    def handleWorkforceScaled(self, line, item_dict):
        isHeaderInLine = "workforce_scaled" in line
        if isHeaderInLine and self.is_workforce_scaled_open == False:
            item_dict["inputs"] = []
            item_dict["outputs"] = []
            self.is_workforce_scaled_open = True

        if self.is_workforce_scaled_open and isHeaderInLine != True:
            if "}" in line:
                self.is_workforce_scaled_open = False
            else:
                if(line.strip() != ""):
                    goods = self.open_goods_json()

                    if("input" in line and "=" in line):
                        results = [good for good in goods if good["name"] in line]
                        amount = line.split("=")[1].strip()
                        if("#" in amount):
                            amount = amount.split("#")[0].strip()
                        input_item = {
                            "good": results[0]["name"],
                            "amount": float(amount)
                        }
                        item_dict["inputs"].append(input_item)
                    elif("output" in line and "=" in line):
                        results = [good for good in goods if good["name"] in line]
                        amount = line.split("=")[1].strip()
                        if("#" in amount):
                            amount = amount.split("#")[0].strip()
                        output_item = {
                            "good": results[0]["name"],
                            "amount": float(amount)
                        }
                        item_dict["outputs"].append(output_item)

        return item_dict

    def open_goods_json(self):
        with open('./goods/goods.json', 'r') as json_file:
            data = json.load(json_file)
        return data