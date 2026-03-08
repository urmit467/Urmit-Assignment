"use client";

import Cell from "./Cell";

type Props = {
  docId: string;
  cells: { [key: string]: string };
};

export default function SpreadsheetGrid({ docId, cells }: Props) {
  const rows = 10;
  const cols = 8;

  const columnLetters = Array.from({ length: cols }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="overflow-auto border">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>

            {columnLetters.map((col) => (
              <th key={col} className="border p-2 bg-gray-100">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 bg-gray-100">
                {rowIndex + 1}
              </td>

              {columnLetters.map((col) => {
                const cellId = `${col}${rowIndex + 1}`;

                return (
                  <Cell
                    key={cellId}
                    docId={docId}
                    cellId={cellId}
                    value={cells[cellId] || ""}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}