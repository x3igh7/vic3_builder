import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';

const useDebounce = (
  callback: () => void,
  wait = 300,
  options: DebounceSettings = {
    leading: false,
    trailing: true,
  },
): DebouncedFunc<() => void> => {
  const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useMemo(() => {
    const func = () => {
      ref.current?.();
    };
    return debounce(func, wait, options);
  }, []);
};

export default useDebounce;
