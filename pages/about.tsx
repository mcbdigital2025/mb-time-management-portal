const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      {/* Hero Section */}
      <section
        className="relative h-70 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(32,48,71,0.45), rgba(32,48,71,0.45)), url('images/Hero-image.png')",
        }}
      >
        <div className="absolute inset-0 bg-[#008080]/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-4xl font-extrabold md:text-5xl">About us</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 md:text-base">
            Our platform is built to simplify how work gets planned, assigned,
            and completed — giving you full visibility and control in one place.
          </p>
        </div>
      </section>

      {/* About Company Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <h2 className="text-[30px] font-extrabold leading-tight text-[#008080]">
              About Company
            </h2>

            <p className="mt-6 text-[16px] font-semibold leading-8 text-[#3e3e3e]">
              Managing jobs, teams, and schedules shouldn’t be complicated. Our
              platform is built to simplify how work gets planned, assigned, and
              completed — giving you full visibility and control in one place.
            </p>

            <p className="mt-6 text-[16px] font-semibold leading-8 text-[#3e3e3e]">
              From organizing daily tasks to coordinating entire teams, we help
              you eliminate confusion, reduce missed assignments, and keep
              operations running smoothly. Whether you're scaling your business
              or improving efficiency, our tools are designed to adapt to the
              way you work.
            </p>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center md:justify-end">
            {/* Top blue shape */}
            <div className="absolute left-6 -top-7.5 h-27.5 w-27.5 rounded-t-full rounded-r-full bg-[#008080]" />

            {/* Bottom blue shape */}
            <div className="absolute -bottom-8.5 right-5 md:-right-14 h-30 w-30 rounded-b-full rounded-l-full bg-[#008080]" />

            {/* Main image card */}
            <div className="relative z-10 w-full max-w-107.5 overflow-hidden rounded-[18px] bg-white shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
              <img
                src="images/Hero-image.png"
                alt="About company"
                className="h-65 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
