'use client';

import { useMemo, useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useBoolean(defaultValue = false) {
  const [value, setValue] = useState(defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

   const onDownload = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      value,
      onTrue,
      onDownload,
      onFalse,
      onToggle,
      setValue,
    }),
    [value, onTrue,onDownload, onFalse, onToggle, setValue]
  );

  return memoizedValue;
}
