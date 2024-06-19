import os
import json
from pdx_text_line_cleaner import PdxTextLineCleaner

class GoodsParser:
    def __init__(self, folder_path):
        self.folder_path = folder_path
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
                    building_district_list += cleaner.clean(self.callback)

                    file.close()
        with open(os.path.join(self.folder_path, 'goods.json'), 'w') as json_file:
            json.dump(building_district_list, json_file)

        return building_district_list

    def callback(self, line, item_dict):
        return item_dict