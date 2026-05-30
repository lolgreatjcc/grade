import "@/styles/globals.css";
import { Reddit_Mono } from "next/font/google";
import { Providers } from "@/components/provider";

const redditMono = Reddit_Mono({
  subsets: ['latin']
})

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <main className={redditMono.className}>
        <Component {...pageProps} />
      </main>
    </Providers>
    
  );
}
