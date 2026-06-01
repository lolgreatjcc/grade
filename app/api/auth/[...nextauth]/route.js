import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import config from '@/config';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: config.OAuthClientId,
      clientSecret: config.OAuthClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: config.secret,
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