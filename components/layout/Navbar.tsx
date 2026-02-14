"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "../../data";
import { NavbarProps } from "../../types";



export default function Navbar({ user, handleLogout }: NavbarProps) {
  return (
    <div className="w-full h-17.5 px-29 py-3.75 flex items-center justify-between bg-white/70 backdrop-blur-md overflow-hidden">
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

      <nav className="flex items-center  space-x-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="  items-center justify-center px-3 py-2.5 font-medium text-sm  "
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex  items-center gap-2.5">
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
            className=" font-medium text-gray-700 hover:text-black px-3 py-2.5 text-sm"
          >
            Login
          </Link>
        )}

        <Link
          href="#"
          className=" text-white bg-[#008080] text-[14px] font-medium px-3 py-2 rounded-[10px] hover:bg-emerald-700 transition"
        >
          Book a demo
        </Link>
      </div>
    </div>
  );
}
