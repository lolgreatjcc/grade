'use client'

import styles from '../Logo.module.css'
import { useRouter } from 'next/router'

export default function Menu() {
    const router = useRouter();
    const loginRedirect = () => {
        router.push('/login');
    }
    return (
        <svg className={`${styles.menuBtn}`} xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" onClick={loginRedirect}>
          <path fill="currentColor" d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
        </svg>  
    );
}