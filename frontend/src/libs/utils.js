import * as XLSX from "xlsx";

export const get = (obj, path) =>
  String(path)
    .split(".")
    .reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function filterByQuery(items, fields, q) {
  const needle = String(q || "")
    .trim()
    .toLowerCase();
  if (!needle) return items;
  return items.filter((row) => {
    const hay = fields
      .map((f) => get(row, f))
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function exportXLSX(filename, rows, columns) {

  const header = columns.map((c) => c.label);
  const data = rows.map((r) =>
    columns.map((c) => {
      const raw = get(r, c.key);
      const v = c.format ? c.format(raw, r) : raw;
      return v == null ? "" : v;
    })
  );
  const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const name = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, name);
}
