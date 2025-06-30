export interface AuthInterface {
    title: string,
    subline: string
}

export interface LoginInterface {
    email: string,
    password: string
}

export interface AuthenticationReturnInterface {
    status: boolean,
    message: string
}