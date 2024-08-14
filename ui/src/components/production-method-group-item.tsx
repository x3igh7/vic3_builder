import { ReactElement, useEffect, useState } from 'react';
import ProductionMethod from '@/interfaces/production-method';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { css } from '@emotion/react';

const ProductionMethodGroupItem = ({
  name,
  displayName,
  groupProductionMethods,
  selectedProductionMethod,
  onSelectedProductionMethodChange,
}: {
  name: string;
  displayName: string;
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
      groupProductionMethods.filter((method) => method.displayName.toLowerCase().includes(e.query.toLowerCase())),
    );
  };

  const handleProductionMethodChange = (e: AutoCompleteSelectEvent) => {
    if (
      e.value?.hasOwnProperty('displayName') &&
      groupProductionMethods.some((method) => method.displayName === e.value?.displayName)
    ) {
      onSelectedProductionMethodChange(name, e.value);
    }
  };

  return (
    <div css={css({ display: 'flex', flexDirection: 'column' })}>
      <label css={{ color: 'var(--text-color-secondary)' }}>{displayName}</label>
      <AutoComplete
        field={'displayName'}
        value={selectedProductionMethod}
        suggestions={suggestedMethods}
        completeMethod={handleMethodSearch}
        onSelect={handleProductionMethodChange}
        dropdown
        forceSelection
      />
    </div>
  );
};

export default ProductionMethodGroupItem;
