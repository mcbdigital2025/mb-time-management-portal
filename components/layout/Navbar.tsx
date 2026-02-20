"use client";
import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavbarProps } from "../../types";

function hrefForKey(key: string) {
  return key === "home" ? "/" : `/${key}`;
}

export default function Navbar({ user, nav = [], handleLogout }: NavbarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenGroup(null);
      }
    }

    if (openGroup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openGroup]);

  const sectionByName = (name: string) => nav.find((s) => s.group === name);

  const home = sectionByName("Home");
  const conv = sectionByName("Conversations");
  const workforce = sectionByName("Workforce");
  const clients = sectionByName("Clients");
  const about = sectionByName("About");

  const renderDropdown = (section?: { group: string; items: any[] }) => {
    if (!section || section.items.length === 0) return null;

    const isOpen = openGroup === section.group;

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Parent button */}
        <button
          type="button"
          className="px-3 py-2 font-medium text-sm rounded-2xl hover:bg-[#008080] inline-flex items-center gap-1 cursor-pointer"
          onClick={() => setOpenGroup(isOpen ? null : section.group)}
        >
          {section.group}
          <span className="text-[10px] leading-none translate-y-px"> <ChevronDown size={20} className="ml-0" /> </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-md z-9999">
            {section.items.map((item, idx) => (
              <Link
                key={item.key}
                href={hrefForKey(item.key)}
                className={[
                  "block px-4 py-2 text-sm font-medium text-gray-800",
                  "hover:bg-[#008080] hover:text-gray-900",
                  idx !== section.items.length - 1
                    ? "border-b border-gray-200"
                    : "",
                ].join(" ")}
                onClick={() => setOpenGroup(null)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-17.5 px-29 py-3.75 flex items-center justify-between bg-white/70 backdrop-blur-md z-50">
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

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        {/* Top-level links */}
        {home?.items?.map((item) => (
          <Link
            key={item.key}
            href={hrefForKey(item.key)}
            className="px-3 py-2 font-medium text-sm rounded-2xl hover:bg-[#008080]"
          >
            {item.label}
          </Link>
        ))}

        {conv?.items?.map((item) => (
          <Link
            key={item.key}
            href={hrefForKey(item.key)}
            className="px-3 py-2 font-medium rounded-2xl text-sm hover:bg-[#008080]"
          >
            {item.label}
          </Link>
        ))}

        {/* Dropdown groups */}
        {renderDropdown(workforce)}
        {renderDropdown(clients)}

        {/* About as top-level */}
        {about?.items?.map((item) => (
          <Link
            key={item.key}
            href={hrefForKey(item.key)}
            className="px-3 py-2 font-medium text-sm rounded-2xl cursor-pointer hover:bg-[#008080]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-2.5">
        {user ? (
          <>
            <span className="text-sm font-semibold">
              Hi, {user.firstName || user.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 hover:text-black"
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
    </div>
  );
}
