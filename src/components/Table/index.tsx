import { ReactNode } from "react";

interface Column<T> {
  prop?: string;
  label: string;
  render?: (row: T) => ReactNode | void;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
}: {
  data: Array<T>;
  columns: Column<T>[];
}) {
  function renderCellContent(column: Column<T>, row: T) {
    if (column.render) {
      return column.render(row);
    }
    return column.prop && row[column.prop];
  }

  return (
    <table className="border-separate border-spacing-0 rounded-xl border border-secondary">
      <thead className="text-left font-semibold">
        <tr className="border border-secondary">
          {columns.map((column, index) => (
            <th key={index} className="px-4 py-3">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rindex) => (
          <tr key={rindex}>
            {columns.map((column, cindex) => (
              <td key={cindex} className="border-t border-secondary p-4">
                {renderCellContent(column, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
