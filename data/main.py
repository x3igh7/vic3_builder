from buildings_parser import BuildingsParser
from goods_parser import GoodsParser
from production_method_groups_parser import ProductionMethodGroupsParser

def main():
    building_parser = BuildingsParser('./buildings')
    result = building_parser.parse()
    print(f"Output: {result}")

    goods_parser = GoodsParser('./goods')
    result = goods_parser.parse()
    print(f"Output: {result}")

    production_method_groups_parser = ProductionMethodGroupsParser('./production_method_groups')
    result = production_method_groups_parser.parse()
    print(f"Output: {result}")

main()