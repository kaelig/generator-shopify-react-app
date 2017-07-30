import * as React from "react";
import { Redirect } from "react-router-dom";

interface ICheckAuthProps {
    children?: any;
    shop: string | null;
    token: string | null;
}

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function CheckAuth(props: ICheckAuthProps): JSX.Element {
    if (!props.token || !props.shop) {
        return <Redirect push={true} to="/login" />;
    }
    return props.children;
}
