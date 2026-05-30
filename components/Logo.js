import { Ponomar } from "next/font/google"
import styles from './Logo.module.css'
import { useRouter } from "next/router"

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function Logo() {
  const router = useRouter();
  const backToLanding = () => {
    router.replace('/');
  }
  return (
    <h2 className={`${ponomar.className} text-8xl ${styles.logoGradient} hover:cursor-pointer`} onClick={backToLanding}>grade</h2>
  )
}