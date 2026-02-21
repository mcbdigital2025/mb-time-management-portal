"use client";
import { useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavbarProps } from "../../../types";
import { NavGroup } from "./NavGroup";

function hrefForKey(key: string) {
  return key === "home" ? "/" : `/${key}`;
}

export default function Navbar({ user, nav = [], handleLogout }: NavbarProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const workforceRef = useRef<HTMLDivElement | null>(null);
  const clientsRef = useRef<HTMLDivElement | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (mobileOpen) {
        if (
          mobilePanelRef.current &&
          !mobilePanelRef.current.contains(target)
        ) {
          closeAll();
        }
        return;
      }

      // Desktop dropdown close
      if (
        openGroup &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpenGroup(null);
      }
    }

    if (openGroup || mobileOpen) {
      document.addEventListener("pointerdown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openGroup, mobileOpen]);

  const sectionByName = (name: string) => nav.find((s) => s.group === name);

  const home = sectionByName("Home");
  const conv = sectionByName("Conversations");
  const workforce = sectionByName("Workforce");
  const clients = sectionByName("Clients");
  const about = sectionByName("About");

  const closeAll = () => {
    setOpenGroup(null);
    setMobileOpen(false);
  };

  return (
    <header className="relative w-full bg-white/70 backdrop-blur-md z-50">
      <div className="w-full h-17.5 md:px-29 py-3.75 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex w-35 h-20 overflow-hidden items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={78}
            height={44}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        {!user ? (
          <nav className="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-3">
            <Link
              href="/"
              className="px-1 md:px-3 py-2 font-medium text-base rounded-2xl hover:bg-[#008080]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-1 md:px-3 py-2 font-medium text-base rounded-2xl hover:bg-[#008080]"
            >
              About
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-3">
            {home?.items?.map((item) => (
              <Link
                key={item.key}
                href={hrefForKey(item.key)}
                className="px-1 md:px-3 py-2 font-medium text-sm rounded-2xl hover:bg-[#008080]"
              >
                {item.label}
              </Link>
            ))}
            {conv?.items?.map((item) => (
              <Link
                key={item.key}
                href={hrefForKey(item.key)}
                className="px-3 py-2 font-medium rounded-2xl md:text-sm text-[12px] hover:bg-[#008080]"
              >
                {item.label}
              </Link>
            ))}

            <NavGroup
              variant="desktop"
              section={workforce}
              isOpen={openGroup === workforce?.group}
              onToggle={() =>
                setOpenGroup(
                  openGroup === workforce?.group
                    ? null
                    : (workforce?.group ?? null),
                )
              }
              onItemClick={() => setOpenGroup(null)}
              rootRef={workforceRef}
            />

            <NavGroup
              variant="desktop"
              section={clients}
              isOpen={openGroup === clients?.group}
              onToggle={() =>
                setOpenGroup(
                  openGroup === clients?.group
                    ? null
                    : (clients?.group ?? null),
                )
              }
              onItemClick={() => setOpenGroup(null)}
              rootRef={clientsRef}
            />

            {about?.items?.map((item) => (
              <Link
                key={item.key}
                href={hrefForKey(item.key)}
                className="px-3 py-2 font-medium md:text-sm text-[12px] rounded-2xl cursor-pointer hover:bg-[#008080]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <>
              <span className="text-sm font-semibold">
                Hi, {user.firstName || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-200 bg-[#F75D42] px-3 py-2 rounded-2xl hover:text-black"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-medium text-gray-700 hover:text-black px-3 py-2.5 text-sm"
            >
              Login
            </Link>
          )}

          <Link
            href="#"
            className="text-white bg-[#008080] text-[14px] font-medium px-3 py-2 rounded-[10px] hover:bg-emerald-700 transition"
          >
            Book a demo
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-black z-50"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          // aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen((v) => !v);
            setOpenGroup(null);
          }}
        >
          {mobileOpen ? (
            <X size={22} className="bg-black" />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/30 z-40" />

          {/* panel */}
          <div
            ref={mobilePanelRef}
            className="absolute top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 pt-4 z-50"
          >
            <button
              type="button"
              className="w-full inline-flex items-end justify-end px-6 rounded-lg hover:bg-gray-100 text-black z-50"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              // aria-expanded={mobileOpen}
              // aria-controls="mobile-nav-panel"
              onClick={() => {
                setMobileOpen((v) => !v);
                setOpenGroup(null);
              }}
            >
              {mobileOpen ? <X size={22} className="" /> : <Menu size={22} />}
            </button>
            <div className="px-4 py-4 space-y-2">
              {/* top links */}
              <div className="border-b border-gray-200 pb-2">
                {home?.items?.map((item) => (
                  <Link
                    key={item.key}
                    href={hrefForKey(item.key)}
                    className="block px-2 pt-2 py-3 text-center text-base font-medium hover:bg-[#008080] rounded-lg border-b border-gray-200"
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}

                {conv?.items?.map((item) => (
                  <Link
                    key={item.key}
                    href={hrefForKey(item.key)}
                    className="block px-2 text-center py-3 text-base font-medium hover:bg-[#008080] rounded-lg border-b border-gray-200"
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}

                {about?.items?.map((item) => (
                  <Link
                    key={item.key}
                    href={hrefForKey(item.key)}
                    className="block px-2 text-center py-2 text-base font-medium hover:bg-[#008080] rounded-lg"
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* groups */}
              {/* {renderMobileGroup(workforce)} */}
              {/* {renderMobileGroup(clients)} */}
              {/* // mobile */}
              <NavGroup
                variant="mobile"
                section={workforce}
                isOpen={openGroup === workforce?.group}
                onToggle={() =>
                  setOpenGroup(
                    openGroup === workforce?.group
                      ? null
                      : (workforce?.group ?? null),
                  )
                }
                onItemClick={closeAll}
              />

              <NavGroup
                variant="mobile"
                section={clients}
                isOpen={openGroup === clients?.group}
                onToggle={() =>
                  setOpenGroup(
                    openGroup === clients?.group
                      ? null
                      : (clients?.group ?? null),
                  )
                }
                onItemClick={closeAll}
              />

              {/* auth + actions */}
              <div className="pt-2 space-y-2">
                {user ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">
                      Hi, {user.firstName || user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout?.();
                        closeAll();
                      }}
                      className="text-sm font-medium bg-[#F75D42] py-1 px-3 rounded-2xl text-gray-100 hover:text-black"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
                    onClick={closeAll}
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="#"
                  className="block text-center text-white bg-[#008080] text-[14px] font-medium px-3 py-2 rounded-[10px] hover:bg-emerald-700 transition"
                  onClick={closeAll}
                >
                  Book a demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
