import { apiCache } from "./cache";

describe("Cache", () => {
  beforeEach(() => {
    apiCache.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("stores and retrieves data", () => {
    const testData = { id: 1, name: "Test" };
    apiCache.set("test-key", testData);
    expect(apiCache.get("test-key")).toEqual(testData);
  });

  it("returns null for non-existent keys", () => {
    expect(apiCache.get("non-existent")).toBeNull();
  });

  it("expires data after TTL", () => {
    const testData = { id: 1, name: "Test" };
    apiCache.set("test-key", testData, 1000); // 1 second TTL

    expect(apiCache.get("test-key")).toEqual(testData);

    jest.advanceTimersByTime(1001); // Advance past TTL

    expect(apiCache.get("test-key")).toBeNull();
  });

  it("invalidates specific keys", () => {
    apiCache.set("key1", "value1");
    apiCache.set("key2", "value2");

    apiCache.invalidate("key1");

    expect(apiCache.get("key1")).toBeNull();
    expect(apiCache.get("key2")).toBe("value2");
  });

  it("invalidates by pattern", () => {
    apiCache.set("user:1", "data1");
    apiCache.set("user:2", "data2");
    apiCache.set("post:1", "post1");

    apiCache.invalidatePattern(/^user:/);

    expect(apiCache.get("user:1")).toBeNull();
    expect(apiCache.get("user:2")).toBeNull();
    expect(apiCache.get("post:1")).toBe("post1");
  });

  it("clears all cache entries", () => {
    apiCache.set("key1", "value1");
    apiCache.set("key2", "value2");

    apiCache.clear();

    expect(apiCache.get("key1")).toBeNull();
    expect(apiCache.get("key2")).toBeNull();
  });
});
