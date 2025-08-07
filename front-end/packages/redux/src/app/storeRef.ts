import { AppStore } from "../lib/store";

let store: AppStore | null = null;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const getStore = (): AppStore | null => {
  return store;
};
