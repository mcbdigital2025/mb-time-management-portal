import {
  ChevronDown,
  LayoutGrid,
  User,
  CalendarDays,
  Building2,
  Users,
  LogIn,
  BriefcaseBusiness,
  CalendarRange,
  MessagesSquare,
  Home,
  Quote,
  Book,
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

function getItemIcon(key: string) {
  const icons: Record<string, React.ReactNode> = {
    landing: <Home size={18} strokeWidth={1.8} />,
    profile: <User size={18} strokeWidth={1.8} />,
    myschedule: <CalendarDays size={18} strokeWidth={1.8} />,
    company: <Building2 size={18} strokeWidth={1.8} />,

    viewemployees: <User size={18} strokeWidth={1.8} />,
    loginemployees: <LogIn size={18} strokeWidth={1.8} />,
    job: <BriefcaseBusiness size={18} strokeWidth={1.8} />,
    employeeschedules: <CalendarRange size={18} strokeWidth={1.8} />,
    conversations: <MessagesSquare size={18} strokeWidth={1.8} />,
    quote: <Quote size={18} strokeWidth={1.8} />,
    client: <Users size={18} strokeWidth={1.8} />,
    bookservice: <Book size={18} strokeWidth={1.8} />,
  };

  return icons[key] ?? <LayoutGrid size={18} strokeWidth={1.8} />;
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
    triggerIcon: isDesktop
      ? "transition-transform duration-200"
      : "transition-transform duration-200",
    panel: isDesktop
      ? "absolute left-1/2 top-full z-50 mt-4 w-[33rem] -translate-x-1/2 overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
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
          className={[cx("triggerIcon"), isOpen ? "rotate-180" : ""]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {isOpen &&
        (isDesktop ? (
          <div className={cx("panel")}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-3 py-4 ">
              {section.items.map((item) => {
                const href = item.href ?? hrefForKey(item.key);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setTimeout(onItemClick, 0)}
                    className="group flex items-center bg-[#008080]/4 gap-4 rounded-2xl px-3 py-3 transition hover:bg-[#008080]"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008080] text-[#e5f1ef]">
                      {item.icon ?? getItemIcon(item.key)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex  items-center gap-2">
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
