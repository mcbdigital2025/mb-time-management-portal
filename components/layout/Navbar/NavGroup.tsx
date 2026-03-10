import {
  ChevronDown,
  ArrowUpRight,
  Activity,
  MessageCircleMore,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

type NavItem = {
  key: string;
  label: string;
  href?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
};

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

  const defaultClasses = {
    root: isDesktop ? "relative" : "border-b border-gray-200 py-2",
    trigger: isDesktop
      ? "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-black hover:text-white cursor-pointer"
      : "w-full flex items-center justify-between px-2 py-2 text-base font-medium",
    triggerLabel: "",
    triggerIcon: isDesktop ? "transition-transform duration-200" : "transition-transform duration-200",
    panel: isDesktop
      ? "absolute left-1/2 top-full z-50 mt-4 w-[44rem] -translate-x-1/2 overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
      : "pl-2 pb-2 border-t border-gray-200",
    item: "",
    itemDivider: "",
  };

  const cx = (slot: keyof typeof defaultClasses) =>
    [defaultClasses[slot], classes?.[slot]].filter(Boolean).join(" ");

  return (
    <div className={cx("root")} ref={rootRef}>
      <button type="button" className={cx("trigger")} onClick={onToggle}>
        {!isDesktop && <span />}
        <span className={cx("triggerLabel")}>{section.group}</span>

        <ChevronDown
          size={isDesktop ? 18 : 18}
          className={[
            cx("triggerIcon"),
            isOpen ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {isOpen &&
        (isDesktop ? (
          <div className={cx("panel")}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 p-6">
              {section.items.map((item) => {
                const href = item.href ?? hrefForKey(item.key);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setTimeout(onItemClick, 0)}
                    className="group flex items-start gap-4 rounded-2xl px-4 py-4 transition hover:bg-[#F6F7F8]"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF8] text-[#2BBE9A]">
                      {item.icon ?? <Wallet size={18} strokeWidth={1.8} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-gray-900">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className="rounded-full bg-[#FCECEF] px-2 py-0.5 text-[11px] font-medium text-[#B8576A]">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <Link
                href="/dashboard"
                onClick={() => setTimeout(onItemClick, 0)}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#22B69A] hover:opacity-80"
              >
                Dashboard
                <ArrowUpRight size={15} />
              </Link>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Link
                  href="/api-status"
                  onClick={() => setTimeout(onItemClick, 0)}
                  className="inline-flex items-center gap-2 hover:text-gray-800"
                >
                  <Activity size={16} />
                  API Status
                </Link>

                <Link
                  href="/support"
                  onClick={() => setTimeout(onItemClick, 0)}
                  className="inline-flex items-center gap-2 hover:text-gray-800"
                >
                  <MessageCircleMore size={16} />
                  Chat to support
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={cx("panel")}>
            {section.items.map((item) => {
              const href = item.href ?? hrefForKey(item.key);

              return (
                <Link
                  key={item.key}
                  href={href}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-[#008080] hover:text-white"
                  onClick={() => setTimeout(onItemClick, 0)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
    </div>
  );
}