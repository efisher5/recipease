import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Outlet, Navigate } from "react-router-dom";

export const AuthenticationGuard = ({ component }: any) => {
    const Component = withAuthenticationRequired(component, {
        
    })
    return <Component />
}