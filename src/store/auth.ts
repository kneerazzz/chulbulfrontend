import {create} from 'zustand'
import {persist} from 'zustand/middleware'


type User = {
    id: string;
    username: string;
    email: string;
    fullname: string;
    profilePic?: string;
}

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}


export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (user) => {
                set({
                    user,
                    isAuthenticated: true
                })
            },

            logout: () =>(
                set({
                    user: null,
                    isAuthenticated: false
                })
            ),
        }),
        {
            name: "auth-storage",
            skipHydration: true
        }
    )
)