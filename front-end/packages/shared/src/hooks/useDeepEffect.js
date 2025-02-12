import { isEqual } from "lodash-es";
import { useEffect, useRef } from "react";

export default function useDeepEffect(callback, dependencies) {
  const previousDeps = useRef();
  if (!isEqual(previousDeps.current, dependencies)) {
    previousDeps.current = dependencies;
  }
  useEffect(callback, [previousDeps.current]);
}
