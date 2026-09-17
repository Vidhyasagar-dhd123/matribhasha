export interface User {
    id?: string;
    _id?: string;
    name: string;
    username: string;
    email: string;
    isBlocked?: boolean;
    role?: "user" | "admin";
    languages?: { name?: string }[];
    bio?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, username: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
    token: string | null;
}