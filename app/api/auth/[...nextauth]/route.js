import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { loadEnvConfig } from '@next/env';
export const dynamic = "force-dynamic";
 
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_OAUTHCLIENTID,
      clientSecret: process.env.NEXT_PUBLIC_OAUTHCLIENTSECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.googleId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (Object.keys(session.user).includes('id') == false) {
        const googleId = token.googleId;
        await axios({
          'method': 'POST',
          'url': `${proccess.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
          'headers': {},
          'data': {
            'googleId': googleId,
            'username': session.user.name,
            'email': session.user.email,
            'token': token,
            'type': 'google'
          }
        }).then((response) => {
          session.user.user_id = response.data.user_id;
          session.user.token = response.data.token;
        }).catch((err) => {
          console.log(err);
        })
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/';
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };