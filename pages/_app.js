import "@/styles/globals.css";
import { Reddit_Mono } from "next/font/google";
import { Providers } from "@/components/provider";
import { AnswerSheetStoreProvider } from "../providers/answerSheetStoreProvider";

const redditMono = Reddit_Mono({
  subsets: ['latin']
})

export default function App({ Component, pageProps }) {
  return (
    <AnswerSheetStoreProvider>
      <Providers>
        <main className={redditMono.className}>
          <Component {...pageProps} />
        </main> 
     </Providers>
    </AnswerSheetStoreProvider>
    
  );
}
