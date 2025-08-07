"use client";

import { persistReducer } from "redux-persist";
import { authReducer, enumReducer, StoreProvider } from "@ring/redux";
import storage from "redux-persist/lib/storage";

const enumPersistConfig = {
  key: "enum",
  version: 1,
  storage,
};

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
};

// Web reducers
const reducers = {
  enum: persistReducer(enumPersistConfig, enumReducer), //ENUM
  auth: persistReducer(authPersistConfig, authReducer), //AUTH
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const devTools = process.env.NEXT_PUBLIC_NODE_ENV === "development";

export default function NextStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider
      {...{
        reducers,
        baseUrl,
        devTools,
      }}
    >
      {children}
    </StoreProvider>
  );
}
