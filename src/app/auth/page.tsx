"use client"

import { useState, FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import PasswordEye from "@/components/ui/password-eye";
import Link from "next/link";

export default function SignComponent () {
    console.log("Sign in page")
    const {data:session} = authClient.useSession();
    let [name,setName] = useState<string>("");
    let [email,setEmail] = useState<string>("");
    let [password,setPassword] = useState<string>("");
    let [showPassword,setShowPassword] = useState<boolean>(false);

    if (session) {
        return (<Button onClick={() => authClient.signOut()}>Sign out</Button>);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="!max-w-[454px] p-6">

                <div className="card-header">
                    <h2 className="text-headline-auth">Log in to your account</h2>
                    <p className="text-subline-auth">Connect to MeetPilot with:</p>                        
                    <div className="flex justify-between gap-2 mt-3">
                        <Button className="pulse-on-click h-[35px] !w-[165px]">
                            <FaGoogle className="text-[10px] mr-2"/>
                            <span className="text-[13px]">Google</span>
                        </Button>
                        <Button className="pulse-on-click h-[35px] !w-[165px]">
                            <FaTwitter className="text-[10px] mr-2"/>
                            <span className="text-[13px]">Twitter</span>
                        </Button>
                    </div>
                </div>

                <div className="text-inline flex items-center gap-3">
                    <hr className="flex-1"/>
                    <p className="text-[12px] uppercase text-gray-500">Or log in with your Email</p>
                    <hr className="flex-1"/>
                </div>

                <div className="form">
                    <Label htmlFor="email" className="text-label !text-[12px] text-gray-500">Email Address</Label>
                    <Input name="email" type="email" className="mt-2"></Input>
                </div>

                <div className="form relative">
                    <Label htmlFor="password" className="text-label !text-[12px] text-gray-500">Password</Label>
                    <Input name="password" type={showPassword ? "text" : "password"} className="mt-2"></Input>
                    <PasswordEye showState={showPassword} fn={setShowPassword} className="absolute top-[38%] right-2"></PasswordEye>
                    <p className="text-[11px] text-blue-900 mt-2 font-[500]">
                        <Link href={'/auth/forget-password'}>Forget your password ?</Link>
                    </p>
                </div>

                <Button>Sign In</Button>
            </Card>
        </div>
    );  
   
}