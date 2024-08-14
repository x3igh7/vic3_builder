import os
import json
from pdx_text_line_cleaner import PdxTextLineCleaner

class GoodsParser:
    def __init__(self, folder_path, output_path):
        self.folder_path = folder_path
        self.output_path = output_path

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
        with open(os.path.join(self.output_path, 'goods.json'), 'w') as json_file:
            json.dump(item_list, json_file)

        return item_list

    def callback(self, line, item_dict):
        item_dict = self.handle_cost(line, item_dict)
        return item_dict

    def handle_cost(self, line, item_dict):
        if "cost" in line:
            parts = line.split("=");
            if parts[0].strip() == "cost":
                try:
                    item_dict["cost"] = int(parts[1].strip())
                except:
                    item_dict["cost"] = parts[1].strip()
        return item_dict