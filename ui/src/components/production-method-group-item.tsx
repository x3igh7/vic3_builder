import { ReactElement, useEffect, useState } from 'react';
import ProductionMethod from '@/interfaces/production_method';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { css } from '@emotion/react';

const ProductionMethodGroupItem = ({
  name,
  groupProductionMethods,
  selectedProductionMethod,
  onSelectedProductionMethodChange,
}: {
  name: string;
  groupProductionMethods: ProductionMethod[];
  selectedProductionMethod: ProductionMethod;
  onSelectedProductionMethodChange: (groupName: string, productionMethod: ProductionMethod) => void;
}): ReactElement => {
  const [suggestedMethods, setSuggestedMethods] = useState<ProductionMethod[]>([]);

  useEffect(() => {
    setSuggestedMethods(groupProductionMethods);
  }, []);

  const handleMethodSearch = (e: AutoCompleteCompleteEvent) => {
    setSuggestedMethods(
      groupProductionMethods.filter((method) => method.name.toLowerCase().includes(e.query.toLowerCase())),
    );
  };

  const handleProductionMethodChange = (e: AutoCompleteChangeEvent) => {
    onSelectedProductionMethodChange(name, e.value);
  };

  return (
    <div css={css({ display: 'flex', flexDirection: 'column' })}>
      <label>{name}</label>
      <AutoComplete
        field={'name'}
        value={selectedProductionMethod}
        suggestions={suggestedMethods}
        completeMethod={handleMethodSearch}
        onChange={handleProductionMethodChange}
        dropdown
      />
    </div>
  );
};

export default ProductionMethodGroupItem;
