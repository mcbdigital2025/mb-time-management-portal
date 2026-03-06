import React from "react";

const AuthLayout = ({
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#008080]/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-96 w-96 rounded-full bg-purple-500/15 blur-2xl" />

      <div
        className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-white/30 bg-white/20 px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:px-8`}
      >
        <div className="mb-6 text-center">
          <h1 className="bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            MCB TimeSheet Management Portal
          </h1>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-zinc-800 sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600/90">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;