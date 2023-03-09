import React, {useContext, useEffect, useState} from "react";
import {getConnection} from "../tools/connection";
import {UserRoles} from "../infrastructure/constants/roles";

type AppRoleContextContent = {
    isAdmin: boolean;
}

export const AppRoleContext = React.createContext<AppRoleContextContent>({isAdmin: false});

export const AppRoleProvider: React.FC = ({children}) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [roles, setRoles] = useState<UserRoles[]>([]);

    useEffect(() => {
        const {client} = getConnection();
        client.user.getRoles().then(response => {
            if (response.type == "SUCCESS") {
                setRoles(response.result);
                setIsAdmin(response.result.includes(UserRoles.Admin));
            }
        })
    }, [])

    return (
        <AppRoleContext.Provider value={{isAdmin}}>
            {children}
        </AppRoleContext.Provider>
    );
};

export const useAppRole = () => useContext(AppRoleContext);