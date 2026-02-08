export interface User{
    id:number;
    email:string;
    username:string;
    role: 'user' | 'admin' | 'moderator';
    is_email_verified:boolean;
    created_at:string;
    last_login:string;
}

export interface AuthResponse{
    success:boolean;
    message:string;
    data:{
        user:User;
        accessToken:string;
    }
}

export interface RegisterInput{
    email:string;
    username:string;
    password:string;
}

export interface LoginInput{
    email:string;
    password:string;
}

export interface RefreshTokenResponse{
    success:boolean;
    message:string;
    data:{
        accessToken:string;
    }
}