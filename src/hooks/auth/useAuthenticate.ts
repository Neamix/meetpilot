import { AuthenticationReturnInterface, LoginInterface } from "@/app/interfaces/AuthInterfaces";
import { authClient } from "@/lib/auth-client";

export async function useAuthenticate ({email,password}:LoginInterface):Promise<AuthenticationReturnInterface> {
    try {
        const result = await authClient.signIn.email({
            email: email,
            password: password,
        })

        if (result.error) {
            return {
                'status': false,
                'message': `${result.error.message}`
            }
        }

        return {
            'status': true,
            'message':  `Success`
        }
    } catch (error) {
        return {
            'status': false,
            'message': `Fatal error: ${error}`
        };
    }
}