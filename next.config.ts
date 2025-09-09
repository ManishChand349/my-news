/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Sabhi domains ko allow karega
      },
    ],
  },
};

export default nextConfig;
