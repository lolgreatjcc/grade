/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL('https://picsum.photos/**')]
  },
  env: {
    NEXT_PUBLIC_OAUTHCLIENTSECRET: process.env.NEXT_PUBLIC_OAUTHCLIENTSECRET,
    NEXT_PUBLIC_OAUTHCLIENTID: process.env.NEXT_PUBLIC_OAUTHCLIENTID,
    NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
  },
};

export default nextConfig;
