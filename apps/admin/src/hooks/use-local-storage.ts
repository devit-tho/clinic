export function useLocalStorage() {}

export const getStorage = <K = string>(key: K) => {
  let value = null;

  try {
    const result = window.localStorage.getItem(key as string);

    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = <K = string, V = never>(key: K, value: V) => {
  try {
    window.localStorage.setItem(key as string, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = <K = string>(key: K) => {
  try {
    window.localStorage.removeItem(key as string);
  } catch (error) {
    console.error(error);
  }
};
