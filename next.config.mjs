export default {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },

  // allowedDevOrigins: [
  //   "recolor-denture-mosaic.ngrok-free.dev",
  //   "*.ngrok-free.dev",
  //   "100.68.118.125:3000", // your local IP
  //   "localhost:3000",
  // ],

//   async rewrites() {
//   return [
//     {
//       source: '/mcbtt/api/:path*',           // ← Important change
//       destination: 'https://ammonium-levers-surfacing.ngrok-free.dev/mcbtt/api/:path*',
//     },
//     // Optional: Keep this if you have other /api calls
//     {
//       source: '/api/:path*',
//       destination: 'https://ammonium-levers-surfacing.ngrok-free.dev/mcbtt/api/:path*',
//     },
//   ];
// },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://100.86.231.87:8085/mcbtt/api/:path*", // Backend URL
      },
    ];
  },
};
