"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EmailInput = ({ onChange, error }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) => {
    return (
        <>
            <Label htmlFor="email" className="text-label !text-[12px] text-gray-500">Email Address</Label>
            <Input 
                name="email" 
                type="email" 
                className="mt-2"
                onChange={(e) => onChange(e)}
            ></Input>
            <span className="text-error">{error}</span> 
        </>
    )
}

export default EmailInput;