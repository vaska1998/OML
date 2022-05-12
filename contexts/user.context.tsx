import {
    AuthCredentials,
    AuthCredentialsWithClaims,
    CREDENTIALS_KEY,
    parseTokenClaims,
    saveTokenToCookie
} from "../tools/token";
import {ClientManagerType, createClientManager} from "../infrastructure/client/manager";
import React, {useState, useContext} from "react";
import {useRouter} from "next/router";
import {AxiosProxy} from "../infrastructure/client/proxy/axios.proxy";
import {setCookie} from "../tools/cookie";

export type AppUserProviderProps = {
    user: AuthCredentialsWithClaims | null;
    client: ClientManagerType;
}

type AppUserContextContent = AppUserProviderProps & {
    isAuthorized: boolean;
    signIn: (credentials: AuthCredentials, rememberMe: boolean) => void;
    signOut: () => void;
}

export const AppUserContext = React.createContext<AppUserContextContent | null>(null);

export const AppUserProvider: React.FC<AppUserProviderProps> = ({children, user, client}) => {
    const [reactUser, setReactUser] = useState<AuthCredentialsWithClaims | null>(user);
    const [isAuthorized, setIsAuthorized] = useState(!!user);
    const [reactClient, setReactClient] = useState(client);
    const router = useRouter();

    const signIn = (credentials: AuthCredentials, rememberMe: boolean) => {
        const {accessToken} = credentials;
        saveTokenToCookie({
            accessToken,
            refreshToken: '',
        }, rememberMe);
        const claims = parseTokenClaims(accessToken);
        setReactUser({
            accessToken,
            refreshToken: '',
            claims
        });
        setIsAuthorized(true);
        const  _client = createClientManager(new AxiosProxy(process.env.NEXT_PUBLIC_API_URL ?? '', accessToken));
        setReactClient(_client);
    };

    const signOut = () => {
        if (!isAuthorized) {
            return;
        }
        setCookie(
            CREDENTIALS_KEY,
            '',
            0,
        );
        setReactClient(createClientManager(new AxiosProxy(process.env.NEXT_PUBLIC_API_URL ?? '', '')));
        setReactUser(null);
        setIsAuthorized(false);
        router.push('/').then();
    };
    return (
        <AppUserContext.Provider
            value={{user: reactUser, isAuthorized, client: reactClient, signIn, signOut}}>
            {children}
        </AppUserContext.Provider>
    );
};

export const userAppUser = () => useContext(AppUserContext)!;
