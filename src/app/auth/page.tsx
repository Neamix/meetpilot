"use client"

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { validateForm, ValidationErrors } from "@/lib/validation";


// Components
import PasswordInput from "./__components/password-input";
import EmailInput from "./__components/email-input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

export default function SignComponent () {
    const {data:session} = authClient.useSession();
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [errors,setErrors] = useState<ValidationErrors>({});
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    if (session) {
        return (<Button onClick={() => authClient.signOut()}>Sign out</Button>);
    }

    /**
     * ---------------------------------------------------------
     * Submit Login Form
     * ---------------------------------------------------------
     * Validate the login form and search on it in database
    */
    async function submitLoginForm  () {
        setErrors({});
        setIsLoading(true);

        try {
            // Validate the form request - Using regular validation instead of hook
            const validator = validateForm(
                {
                    email: email,
                    password: password
                },
                {
                    email: 'required|email',
                    password: 'required|min:8|max:100',
                }
            );

            // In case that there is validation error stop the request
            if (!validator.isValid) {
                setErrors(validator.errors)
                setIsLoading(false);
                return false;
            }        

            // Login using auth client directly
            const result = await authClient.signIn.email({
                email: email,
                password: password,
            });

            if (result.error) {
                setErrors({
                    authentication: [result.error.message || 'Authentication failed']
                });
            } else {
                router.push('/');
            }

        } catch (error) {
            setIsLoading(false);
            setErrors({
                authentication:[`${error}`]
            })
        } finally {
            setIsLoading(false);
        }
    }

    // Social login handler
    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        try {
            if (provider === 'google') {
                await authClient.signIn.social({
                    provider: 'google'
                });
            } else if (provider === 'facebook') {
                await authClient.signIn.social({
                    provider: 'facebook'
                });
            }
        } catch (error) {
            console.error('Social login error:', error);
        }
    };

    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="!max-w-[454px] p-6">

                    <div className="card-header">
                        <h2 className="text-headline-auth">Log in to your account</h2>
                        
                        <p className="text-subline-auth">Connect to MeetPilot with:</p>

                        <div className="flex justify-between gap-2 mt-3">

                            <Button className="pulse-on-click h-[35px] !w-[165px]" onClick={() => handleSocialLogin('google')}>
                                <FaGoogle className="text-[10px] mr-2"/>
                                <span className="text-[13px]">Google</span>
                            </Button>

                            <Button className="pulse-on-click h-[35px] !w-[165px]" onClick={() => handleSocialLogin('facebook')}>
                                <FaFacebook className="text-[10px] mr-2"/>
                                <span className="text-[13px]">Facebook</span>
                            </Button>

                        </div>

                    </div>

                    <div className="text-inline flex items-center gap-3">
                        <hr className="flex-1"/>
                        <p className="text-[12px] uppercase text-gray-500">Or log in with your Email</p>
                        <hr className="flex-1"/>
                    </div>

                    <form className="w-full">               
                        <div className="form">
                            <EmailInput
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email ? errors.email[0] : ''}
                            />
                            <span className="text-error">{errors.authentication}</span>
                        </div>

                        <div className="form relative mt-4">
                            <PasswordInput
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password ? errors.password[0] : ''}
                            />
                            <p className="text-[11px] text-blue-900 mt-2 font-[500]">
                                <Link href={'/auth/forget-password'}>Forget your password ?</Link>
                            </p>
                        </div>


                        <Button
                            className="w-full mt-2"
                            onClick={() => submitLoginForm()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                            ) : (
                            "Sign in"
                            )}
                        </Button>
                    </form>

                </Card>
        </div>
    );  
   
}