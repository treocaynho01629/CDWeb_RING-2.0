import "@testing-library/jest-dom/vitest";

import createFetchMock from "vitest-fetch-mock";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

vi.mock("localforage");

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
});

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: vi.fn(),
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
