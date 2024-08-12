import os
import json
import re

class LocalizationParser:
    def __init__(self, folder_path, output_path):
        self.folder_path = folder_path
        self.output_path = output_path

    def parse(self):
      localized_strings = []
      for filename in os.listdir(self.folder_path):
        if filename.endswith(".yml"):
          print(f"Parsing file: {filename}")
          with open(os.path.join(self.folder_path, filename), "r") as file:  # Open file
            lines = file.readlines()
            parsed_lines = self.parse_lines(lines)
            localized_strings.extend(parsed_lines)

            file.close()
          with open(os.path.join(self.output_path, 'localization.json'), 'w') as json_file:
            json.dump(localized_strings, json_file)


    def parse_lines(self, lines):
      parsed_lines = []
      for line in lines:
        if not "l_english:" in line:
          loc_name = line.split(":")[0]
          match = re.search(r'"(.*?)"', line)
          if match:
            loc_value = match.group(1).strip()
            loc = {"name": loc_name, "value": loc_value}
            parsed_lines.append(loc)
      return parsed_lines