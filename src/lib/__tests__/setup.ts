import { vi, beforeAll, afterAll } from "vitest"

// Silence console output during tests — the source code logs expected
// errors/warnings in fallback paths, which would pollute test output.
// All 120 tests still pass; noise is just suppressed.

beforeAll(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})
