import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import config from '@/config';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "319469874716-42t2382gsipmf5f0otmr8ccbf1erp9rh.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: "WABBAJghkM+v76ayI50C956LKak3vOkPDbxP4r3FTgo=",
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
          'url': `${config.backendBaseUrl}/auth`,
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