import "@/styles/globals.css";
import { Reddit_Mono } from "next/font/google";

const redditMono = Reddit_Mono({
  subsets: ['latin']
})

export default function App({ Component, pageProps }) {
  return (
    <main className={redditMono.className}>
      <Component {...pageProps} />
    </main>
  );
}
