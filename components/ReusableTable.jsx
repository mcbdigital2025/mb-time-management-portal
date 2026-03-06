"use client";
import React from "react";

/** Inline SVG icons (no libraries) */
const PencilIcon = ({ className = "w-4 h-4" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
);

/**
 * columns: [{ header: string, accessor?: string, render?: (row) => ReactNode, align?: "left"|"center"|"right", className?: string }]
 * actions: [{ label: string, onClick: (row)=>void, variant?: "primary"|"danger"|"outline", icon?: "edit"|"trash"|"none", showLabel?: boolean, title?: string, disabled?: (row)=>boolean }]
 */
export default function ReusableTable({
    data = [],
    columns = [],
    actions = [],
    getRowKey = (row, idx) => idx,
    selectedRow = null,
    isRowSelected = () => false,
    onRowClick,
    footerLeft,
    footerRight,
    emptyText = "No records found.",
}) {
    const alignClass = (align) =>
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

    const actionBtnClass = (variant) => {
        switch (variant) {
            case "primary":
                return "bg-[#008080] text-white hover:bg-teal-700";
            case "danger":
                return "text-red-600 hover:bg-red-50";
            case "outline":
            default:
                return "text-gray-700 hover:bg-gray-50";
        }
    };

    const actionIcon = (icon) => {
        if (icon === "edit") return <PencilIcon />;
        if (icon === "trash") return <TrashIcon />;
        return null;
    };

    return (
        <div className="px-1 md:px-6 pb-6 overflow-x-auto">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                    <thead className="hero-radial-background">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-1 font-semibold text-gray-600 ${alignClass(col.align)} ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}

                            {actions.length > 0 && (
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white/40">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => {
                                const selected = isRowSelected(row);

                                return (
                                    <tr
                                        key={getRowKey(row, idx)}
                                        onClick={() => onRowClick?.(row)}
                                        className={`transition ${onRowClick ? "cursor-pointer" : ""} ${selected ? "bg-blue-50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {columns.map((col, i) => {
                                            const content =
                                                col.render
                                                    ? col.render(row)
                                                    : col.accessor
                                                        ? row?.[col.accessor]
                                                        : "";

                                            return (
                                                <td
                                                    key={i}
                                                    className={`px-4 text-xs md:text-sm py-2 text-gray-700 ${alignClass(col.align)} ${col.className || ""}`}
                                                >
                                                    {content ?? "-"}
                                                </td>
                                            );
                                        })}

                                        {actions.length > 0 && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    {actions.map((a, i) => {
                                                        const disabled = a.disabled?.(row) ?? false;
                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                disabled={disabled}
                                                                title={a.title || a.label}
                                                                aria-label={a.title || a.label}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    a.onClick(row);
                                                                }}
                                                                className={`inline-flex items-center justify-center ${a.showLabel ? "px-3" : "w-9"
                                                                    } h-9 rounded-lg border border-gray-200 transition ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                                                    } ${actionBtnClass(a.variant)}`}
                                                            >
                                                                {a.icon && actionIcon(a.icon)}
                                                                {a.showLabel && (
                                                                    <span className={a.icon ? "ml-1" : ""}>{a.label}</span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-800">
                <span className="">{footerLeft}</span>
                <span className="hidden sm:inline">{footerRight}</span>
            </div>
        </div>
    );
}