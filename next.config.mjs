/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL('https://picsum.photos/**')]
  }
};

export default nextConfig;
