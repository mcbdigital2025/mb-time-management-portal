import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type NavItem = { key: string; label: string; href?: string };
type NavSection = { group: string; items: NavItem[] };

type Variant = "desktop" | "mobile";

function hrefForKey(key: string) {
  return key === "home" ? "/" : `/${key}`;
}

export function NavGroup({
  section,
  variant,
  isOpen,
  onToggle,
  onItemClick,
  rootRef,
  classes = {},
}: {
  section?: NavSection;
  variant: Variant;

  isOpen: boolean;
  onToggle: () => void;
  onItemClick: () => void;

  rootRef?: React.Ref<HTMLDivElement>;

  classes?: Partial<{
    root: string;
    trigger: string;
    triggerLabel: string;
    triggerIcon: string;
    panel: string;
    item: string;
    itemDivider: string;
  }>;
}) {
  if (!section || section.items.length === 0) return null;

  const isDesktop = variant === "desktop";

  const defaultClasses: Required<NonNullable<typeof classes>> = {
    root: isDesktop ? "relative" : "border-b border-gray-200 py-2",
    trigger: isDesktop
      ? "px-3 py-2 font-medium text-sm rounded-2xl hover:bg-[#008080] inline-flex items-center gap-1 cursor-pointer"
      : "w-full flex items-center justify-between px-2 py-2 text-base font-medium",
    triggerLabel: isDesktop ? "" : "-mr-5",
    triggerIcon: isDesktop ? "" : "transition-transform",
    panel: isDesktop
      ? "absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-md z-50"
      : "pl-2 pb-2 border-t border-gray-200",
    item: "block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-[#008080] hover:text-gray-900",
    itemDivider: "border-b border-gray-200",
  };

  const cx = (slot: keyof typeof defaultClasses) =>
    [defaultClasses[slot], classes?.[slot]].filter(Boolean).join(" ");

  return (
    <div className={cx("root")} ref={rootRef}>
      <button type="button" className={cx("trigger")} onClick={onToggle}>
        {!isDesktop && <span />}

        <span className={cx("triggerLabel")}>{section.group}</span>

        <ChevronDown
          size={isDesktop ? 20 : 18}
          className={[
            cx("triggerIcon"),
            !isDesktop && isOpen ? "rotate-180" : "",
            isDesktop ? "ml-0" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {isOpen && (
        <div className={cx("panel")}>
          {section.items.map((item, idx) => {
            const href = item.href ?? hrefForKey(item.key);

            return (
              <Link
                key={item.key}
                href={href}
                className={[
                  cx("item"),
                  idx !== section.items.length - 1 ? cx("itemDivider") : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setTimeout(onItemClick, 0);
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
