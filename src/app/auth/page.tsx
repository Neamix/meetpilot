"use client"

import { useState, FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SignUp () {
    const {data:session} = authClient.useSession();
    let [name,setName] = useState("");
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");

    // Submit sign up form
    function SubmitSignUpForm(e: FormEvent) {
        e.preventDefault();
        SaveUserData();
    }

    // Send the data to database
    async function SaveUserData() {
        const { data, error } = await authClient.signUp.email(
        {email,password,name,callbackURL: "/dashboard"}, 
        {
            onRequest: (ctx) => {
            },
            onSuccess: (ctx) => {
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        });
    }

    if (!session) {
        return (
            <div className="">
                <form onSubmit={(e) => SubmitSignUpForm(e)}>
                    <input name="name" type="text" placeholder="set name"   onChange={(e) => setName(e.target.value)}></input>    
                    <input name="email" type="email" placeholder="set email" onChange={(e) => setEmail(e.target.value)}></input>    
                    <input name="password" type="password" placeholder="set password" onChange={(e) => setPassword(e.target.value)}></input>
                    <button>Submit</button>
                </form>  
            </div>
        );  
    } else {
        return (
            <Button onClick={() => authClient.signOut()}>Sign out</Button>
        );
    }
   
}