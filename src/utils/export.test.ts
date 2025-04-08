import { exportData } from "./export";

describe("exportData", () => {
  let mockCreateElement: jest.SpyInstance;
  let mockAppendChild: jest.SpyInstance;
  let mockRemoveChild: jest.SpyInstance;
  let mockClick: jest.SpyInstance;
  let mockCreateObjectURL: jest.SpyInstance;
  let mockRevokeObjectURL: jest.SpyInstance;

  beforeEach(() => {
    mockCreateElement = jest.spyOn(document, "createElement");
    mockAppendChild = jest.spyOn(document.body, "appendChild");
    mockRemoveChild = jest.spyOn(document.body, "removeChild");
    mockClick = jest.fn();
    mockCreateObjectURL = jest.spyOn(URL, "createObjectURL");
    mockRevokeObjectURL = jest.spyOn(URL, "revokeObjectURL");

    mockCreateElement.mockReturnValue({
      click: mockClick,
    } as unknown as HTMLAnchorElement);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should export data as CSV", () => {
    const testData = [
      { name: "John", age: 25 },
      { name: "Jane,Doe", age: 30 },
    ];

    exportData(testData, { format: "csv", fileName: "test" });

    const expectedCSV = 'name,age\n"John",25\n"Jane,Doe",30';
    expect(mockCreateObjectURL).toHaveBeenCalledWith(
      new Blob([expectedCSV], { type: "text/csv" })
    );
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockClick).toHaveBeenCalled();
  });

  it("should export data as JSON", () => {
    const testData = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];

    exportData(testData, { format: "json", fileName: "test" });

    const expectedJSON = JSON.stringify(testData, null, 2);
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockClick).toHaveBeenCalled();
  });

  it("should use default filename if not provided", () => {
    const testData = [{ name: "John" }];
    const today = new Date().toISOString().split("T")[0];

    exportData(testData, { format: "json" });

    expect(mockCreateElement).toHaveBeenCalledWith("a");
    expect(mockClick).toHaveBeenCalled();
  });

  it("should handle empty data for CSV", () => {
    const testData: any[] = [];

    exportData(testData, { format: "csv" });

    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(mockClick).not.toHaveBeenCalled();
  });
});
