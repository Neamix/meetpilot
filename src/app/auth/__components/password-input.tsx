"use client"

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const PasswordInput = ({ onChange, error }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) => {
    const [showPassword,setShowPassword] = useState<boolean>(false);

    return (
        <>
            <Label htmlFor="password" className="text-label !text-[12px] text-gray-500">
                Password
            </Label>

            <div className="relative">
                <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-2"
                    onChange={(e) => onChange(e)}
                />
                <div className={`password-eye cursor-pointer select-none`}>
                    {(!showPassword) ? 
                        <IoEye onClick={() => setShowPassword(true)}/> : 
                        <IoMdEyeOff onClick={() => setShowPassword(false)}/>
                    }
                </div>
            </div>

            <span className="text-error">{error}</span> 
        </>
    )
}

export default PasswordInput;