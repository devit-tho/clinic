import React, { useEffect, useState } from 'react';

// -----------------------------------------------------------

type UseLocalStorageStateReturnType<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
];

export function useLocalStorageState<T = string>(
  initialState: T,
  key?: string,
): UseLocalStorageStateReturnType<T> {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key!);

    return storedValue ? (storedValue as T) : (initialState as T);
  });

  useEffect(() => {
    localStorage.setItem(key!, value as string);
  }, [key, value]);

  return [value, setValue];
}
