/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://picsum.photos/**'), 
      new URL('https://drive-thirdparty.googleusercontent.com/**')
    ]
  },
  env: {
    NEXT_PUBLIC_OAUTHCLIENTSECRET: process.env.NEXT_PUBLIC_OAUTHCLIENTSECRET,
    NEXT_PUBLIC_OAUTHCLIENTID: process.env.NEXT_PUBLIC_OAUTHCLIENTID,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
  },
};

export default nextConfig;
