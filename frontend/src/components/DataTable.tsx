import { Pencil, Trash2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showActions?: boolean;
}

function DesktopTable({ columns, data, showActions, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-50 border-b border-blue-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-5 py-3.5 font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th className="text-left px-5 py-3.5 font-semibold text-gray-700 whitespace-nowrap">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="px-5 py-12 text-center text-gray-400"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`border-b border-gray-100 transition-colors duration-150 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                } hover:bg-blue-50/40`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-gray-600">
                    {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ columns, data, showActions, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-medium">Tidak ada data</div>
      ) : (
        data.map((row, idx) => (
          <div
            key={row.id || idx}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-start gap-2 text-sm">
                <span className="font-semibold text-gray-500 min-w-[90px] shrink-0">
                  {col.label}
                </span>
                <span className="text-gray-800">
                  {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                </span>
              </div>
            ))}
            {showActions && (
              <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  showActions = true,
}: DataTableProps) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopTable
          columns={columns}
          data={data}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <div className="block md:hidden">
        <MobileCards
          columns={columns}
          data={data}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
