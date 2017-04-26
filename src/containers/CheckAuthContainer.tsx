import * as React from "react";
import { Redirect } from "react-router-dom";

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function CheckAuthContainer(props: { children?: any }): JSX.Element {
    const token = sessionStorage.getItem("token");
    const shop = sessionStorage.getItem("shop");
    if (!token || !shop) {
        return <Redirect push={true} to="/login" />;
    }
    return props.children;
}