from buildings_parser import BuildingsParser
from goods_parser import GoodsParser
from production_method_groups_parser import ProductionMethodGroupsParser
from pop_types_parser import PopTypesParser
from production_methods_parser import ProductionMethodsParser

def main():
    output_folder = '../ui/public/data'

    building_parser = BuildingsParser('./buildings', output_folder)
    result = building_parser.parse()
    print(f"Output: {result}")

    goods_parser = GoodsParser('./goods', output_folder)
    result = goods_parser.parse()
    print(f"Output: {result}")

    pop_types_parser = PopTypesParser('./pop_types', output_folder)
    result = pop_types_parser.parse()
    print(f"Output: {result}")

    production_method_groups_parser = ProductionMethodGroupsParser('./production_method_groups', output_folder)
    result = production_method_groups_parser.parse()
    print(f"Output: {result}")

    production_method_parser = ProductionMethodsParser('./production_methods', output_folder)
    result = production_method_parser.parse()
    print(f"Output: {result}")

main()