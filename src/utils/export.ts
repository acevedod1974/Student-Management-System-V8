export interface ExportOptions {
  format: "csv" | "json";
  fileName?: string;
}

export function exportData<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions
): void {
  const fileName =
    options.fileName || `export-${new Date().toISOString().split("T")[0]}`;

  let content: string;
  let mimeType: string;

  if (options.format === "csv") {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const cell = row[header]?.toString() || "";
            return cell.includes(",") ? `"${cell}"` : cell;
          })
          .join(",")
      ),
    ].join("\n");

    content = csvContent;
    mimeType = "text/csv";
  } else {
    content = JSON.stringify(data, null, 2);
    mimeType = "application/json";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.${options.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
