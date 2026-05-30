import styles from './Auth.module.css'
import { handleSignIn } from '@/utils/googleAuth';

export default function SignInWithGoogle() {  
    return (
        <div className="items-center">
            <button onClick={handleSignIn} className={`${styles.signInButton}`}>Sign in with Google</button>
        </div>
    );
}