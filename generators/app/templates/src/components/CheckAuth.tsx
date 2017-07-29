import * as React from "react";
import { Redirect } from "react-router-dom";
import { SHOP_KEY, TOKEN_KEY } from "../constants";

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function CheckAuth(props: { children?: any }): JSX.Element {
    const shop = localStorage.getItem(SHOP_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !shop) {
        return <Redirect push={true} to="/login" />;
    }
    return props.children;
}
