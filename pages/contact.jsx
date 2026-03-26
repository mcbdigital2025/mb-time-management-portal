import React from "react";

const IconWrap = ({ children }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#008080] text-[#008080]">
    {children}
  </div>
);

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#2c2c2c]">
      {/* Hero */}
      <section
        className="relative h-55 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(32,48,71,0.45), rgba(32,48,71,0.45)), url('images/Hero-image.png')",
        }}
      >
        <div className="absolute inset-0 flex flex-col b items-center justify-center text-center">
          <h1 className="text-[54px] font-medium tracking-[0.5px] 
          text-[#ffffff]">
            Contact Us
          </h1>
          
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left form */}
          <div className="max-w-107.5">
            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-[14px] font-medium text-[#008080]">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="h-9.5 w-full rounded-md border border-[#bfc6cf] px-4 text-[14px] outline-none placeholder:text-[#9aa3ad] focus:border-[#008080]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[14px] font-medium text-[#008080]">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="h-9.5 w-full rounded-md border border-[#bfc6cf] px-4 text-[14px] outline-none placeholder:text-[#9aa3ad] focus:border-[#008080]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[14px] font-medium text-[#6a6a6a]">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Subject"
                  className="h-[38px] w-full rounded-md border border-[#bfc6cf] px-4 text-[14px] outline-none placeholder:text-[#9aa3ad] focus:border-[#008080]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[14px] font-medium text-[#6a6a6a]">
                  Your Message
                </label>
                <textarea
                  placeholder="Message"
                  rows={5}
                  className="w-full rounded-md border border-[#bfc6cf] px-4 py-3 text-[14px] outline-none placeholder:text-[#9aa3ad] focus:border-[#008080]"
                />
              </div>

              <button
                type="submit"
                className="mt-1 inline-flex h-[34px] items-center rounded-sm bg-[#008080] px-5 py-5 text-[14px] font-semibold uppercase tracking-[1.4px] text-white transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right info */}
          <div className="max-w-117.5">
            <p className="text-[16px] italic text-[#008080]">Contact Us</p>

            <h2 className="mt-2 text-[38px] font-semibold leading-none text-[#008080]">
              Get In Touch
            </h2>

            <p className="mt-5 max-w-105 text-[16px] leading-6 text-[#8a8a8a]">
              Managing jobs shouldn’t feel like chaos. Our scheduling platform helps you organize tasks, assign work effortlessly, and keep your team aligned in real time. Spend less time coordinating — and more time getting things done.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <IconWrap>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2a1 1 0 011-.24c1.12.37 2.33.56 3.59.56a1 1 0 011 1V20a1 1 0 01-1 1C10.3 21 3 13.7 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.26.19 2.47.56 3.59a1 1 0 01-.25 1l-2.19 2.2z" />
                  </svg>
                </IconWrap>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#2a2a2a]">
                    Call Us
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8a8a8a]">
                    +123 1256 7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconWrap>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M4 5h16a2 2 0 012 2v.4l-10 6.25L2 7.4V7a2 2 0 012-2zm18 4.15V17a2 2 0 01-2 2H4a2 2 0 01-2-2V9.15l9.47 5.92a1 1 0 001.06 0L22 9.15z" />
                  </svg>
                </IconWrap>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#2a2a2a]">
                    Email Us
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8a8a8a]">
                    mabocore@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconWrap>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 9h-3.01a15.7 15.7 0 00-1.2-5.03A8.03 8.03 0 0118.93 11zM12 4.07c.83 1.2 1.87 3.45 2.2 6.93H9.8c.33-3.48 1.37-5.73 2.2-6.93zM4.07 13h3.01c.16 1.8.58 3.54 1.2 5.03A8.03 8.03 0 014.07 13zm3.01-2H4.07a8.03 8.03 0 014.21-5.03A15.7 15.7 0 007.08 11zm4.92 8.93c-.83-1.2-1.87-3.45-2.2-6.93h4.4c-.33 3.48-1.37 5.73-2.2 6.93zM14.72 18.03c.62-1.49 1.04-3.23 1.2-5.03h3.01a8.03 8.03 0 01-4.21 5.03z" />
                  </svg>
                </IconWrap>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#2a2a2a]">
                    Website
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8a8a8a]">
                    mabocore.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconWrap>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6a2.5 2.5 0 000 5.5z" />
                  </svg>
                </IconWrap>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#2a2a2a]">
                    Address
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8a8a8a]">
                    99 Roving St., Big City, PKU 23456
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[16px] font-semibold text-[#2a2a2a]">
                Follow Us On
              </h3>

              <div className="mt-2 flex items-center gap-2">
                {["f", "X", "in"].map((item) => (
                  <div
                    key={item}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#008080] text-[11px] font-semibold text-white cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;