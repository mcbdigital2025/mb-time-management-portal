export default {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8085/mcbtt/api/:path*", // Backend URL
            },
        ];
    },
};
