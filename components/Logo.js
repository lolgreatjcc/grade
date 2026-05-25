import { Ponomar } from "next/font/google"
import styles from './Logo.module.css'

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function Logo() {
  return (
    <h2 className={`${ponomar.className} text-8xl ${styles.logoGradient}`}>grade</h2>
  )
}