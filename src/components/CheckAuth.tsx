import * as React from "react";
import { Redirect } from "react-router-dom";
import { config } from "../config";

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function CheckAuth(props: { children?: any }): JSX.Element {
    const token = localStorage.getItem(config.tokenKey);
    const shop = localStorage.getItem(config.shopKey);
    if (!token || !shop) {
        return <Redirect push={true} to="/login" />;
    }
    return props.children;
}