export default {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://100.86.231.87:8085/mcbtt/api/:path*", // Backend URL
      },
    ];
  },
};

