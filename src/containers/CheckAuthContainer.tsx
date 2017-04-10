import * as React from "react";
import { Redirect } from "react-router-dom";

export function CheckAuthContainer(props: {children?: any}): JSX.Element {
    const token = sessionStorage.getItem("token");
    const shop = sessionStorage.getItem("shop");
    if (!token || !shop) {
        return <Redirect push={true} to="/login" />;
    }
    return props.children;
}