import os
import json
import re

class LocalizationParser:
    def __init__(self, folder_path, output_path):
        self.folder_path = folder_path
        self.output_path = output_path

    def parse(self):
      localized_strings = {}
      for filename in os.listdir(self.folder_path):
        if filename.endswith(".yml"):
          print(f"Parsing file: {filename}")
          with open(os.path.join(self.folder_path, filename), "r") as file:  # Open file
            lines = file.readlines()
            parsed_lines = self.parse_lines(lines)
            localized_strings = {**localized_strings, **parsed_lines}

            file.close()

      localized_strings = self.replace_dollars_with_localized(localized_strings)

      with open(os.path.join(self.output_path, 'translation.json'), 'w') as json_file:
        json.dump(localized_strings, json_file)

      return localized_strings


    def parse_lines(self, lines):
      parsed_lines = {}
      for line in lines:
        if not "l_english:" in line:
          loc_name = line.split(":")[0].strip()
          match = re.search(r'"(.*?)"', line)
          if match:
            loc_value = match.group(1).strip()
            parsed_lines[loc_name] = loc_value

      return parsed_lines

    def replace_dollars_with_localized(self, localized_strings):
      for key in localized_strings:
          match = re.match(r'\$(.*?)\$', localized_strings[key])
          if match:
            defined_key = localized_strings.get(match.group(1), match.group(1))
            localized_strings[key] = defined_key


      return localized_strings