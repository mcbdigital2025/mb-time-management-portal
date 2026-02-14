import Link from "next/link";
import { companyLinks, productLinks, supportLinks } from "../data/index";

export default function Footer() {
  return (
    <footer className="w-full bg-[#020618]">
      <div className="border w-full max-w- py-17.5 px-45 space-y-4">
        <div className="grid grid-cols-4 gap-10 py-10">
          {/* Left column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="MaboCore"
                className="h-11 w-19.5 rounded-lg "
              />
            </div>

            <p className="  text-[13px] leading-4 text-white/60">
              The modern workforce management platform for forward-thinking
              service businesses.
            </p>

            {/* Social icons */}
            <div className=" flex items-center gap-2">
              {["f", "in", "X", "t"].map((k) => (
                <span
                  key={k}
                  className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/80"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterCol title="Product" links={productLinks} />
          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Support" links={supportLinks} />
        </div>

        {/* Bottom row */}
        <div className="flex border-t border-[#FFFFFF1F] items-center justify-between py-4">
          <div className="text-[14px] text-white/50">
            © {new Date().getFullYear()} MaboCore Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[14px] text-white/50">
            <Link href="#" className="hover:text-white/70 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white/70 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="text-[18px] font-bold text-white">{title}</div>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-[14px] text-white/70 hover:text-white/15 transition"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
