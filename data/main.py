from buildings_parser import BuildingsParser
from goods_parser import GoodsParser
from production_method_groups_parser import ProductionMethodGroupsParser
from pop_types_parser import PopTypesParser
from production_methods_parser import ProductionMethodsParser

def main():
    building_parser = BuildingsParser('./buildings')
    result = building_parser.parse()
    print(f"Output: {result}")

    goods_parser = GoodsParser('./goods')
    result = goods_parser.parse()
    print(f"Output: {result}")

    pop_types_parser = PopTypesParser('./pop_types')
    result = pop_types_parser.parse()
    print(f"Output: {result}")

    production_method_groups_parser = ProductionMethodGroupsParser('./production_method_groups')
    result = production_method_groups_parser.parse()
    print(f"Output: {result}")

    production_method_parser = ProductionMethodsParser('./production_methods')
    result = production_method_parser.parse()
    print(f"Output: {result}")

main()