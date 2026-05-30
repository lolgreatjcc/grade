import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useState } from "react";
import Menu from "@/components/Menu/Menu";
import { useSession } from "next-auth/react";
import SignInWithGoogle from "@/components/Auth/SignInWithGoogle";

export default function Home() {
    const session = useSession().data;
    console.log(session);


  return (
    <div className="min-h-screen">
        <meta name="google-signin-client_id" content="319469874716-42t2382gsipmf5f0otmr8ccbf1erp9rh.apps.googleusercontent.com"/>
        <div className="absolute left-10"><Logo /></div>
        <div className="absolute right-5 top-5">
            <Menu />
        </div>
        <div
            className={`min-h-screen flex items-center justify-center flex-col`}>
        <div>
            <div className={`${styles.signInContainer}`}>
                <h1 className="text-xl text-center">Welcome Back</h1>
                <div>
                    <div>
                        <div className="flex justify-center my-2">
                            <input placeholder="Email" className={`${styles.inputField}`}/>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center my-2">
                            <input placeholder="Password" className={`${styles.inputField}`}/>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center pt-5">
                            <button className={`${styles.logInButton}`}>Sign In</button>
                        </div>
                    </div>
                    
                </div>
                <div className="my-4">
                    <h1 className="text-center">Or</h1>
                </div>
                <div className="flex justify-center">
                    <SignInWithGoogle />
                </div>
                
                
                {/* {session ? (
                    <div>
                        <div>
                            <h1 className="text-center text-2xl py-5">Want to change accounts, {session.user.name}?</h1>
                        </div>
                        <div className="flex justify-center">
                            <button className={`${styles.signInButton}`} onClick={handleSignOut}>Sign Out</button>
                        </div>
                    
                    
                    </div>
                ) : (
                    <div className="items-center">
                        
                        <button onClick={handleSignIn} className={`${styles.signInButton}`}>Sign in with Google</button>
                    </div>
                    
                )} */}
            </div>
        </div>
      </div>
    </div>
  );

}
