import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useState } from "react";
import Menu from "@/components/Global/Menu";
import { useSession } from "next-auth/react";
import { handleSignIn, handleSignOut } from "@/utils/googleAuth";

export default function Home() {
    const session = useSession().data;
    console.log(session);
//   const onSignIn = (googleUser) => {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//}

  return (
    <div className="min-h-screen">
        <meta name="google-signin-client_id" content="319469874716-42t2382gsipmf5f0otmr8ccbf1erp9rh.apps.googleusercontent.com"/>
        <div className="absolute left-10"><Logo /></div>
        <div className="absolute right-5 top-5">
            <Menu />
        </div>
        <div
            className={`min-h-screen flex items-center justify-center flex-col`}>
        <div className="flex">
            <main className="flex items-center justify-center min-h-screen">
                {session ? (
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
                        <h1 className="text-center text-2xl py-5">Welcome back</h1>
                        <button onClick={handleSignIn} className={`${styles.signInButton}`}>Sign in with Google</button>
                    </div>
                    
                )}
            </main>
        </div>
      </div>
    </div>
  );

}
