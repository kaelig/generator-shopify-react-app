import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";

import { config } from "../config";

export function LogoutContainer(_props: RouteComponentProps<undefined>) {
    // Remove the token and shop from our session storage. These are used by the CheckAuth to determine if someone is logged in
    localStorage.removeItem(config.authTokenKey);
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.shopKey);

    // Redirect the user to login page
    return (
        <div className="application">
            <Helmet>
                <link rel="stylesheet" href="/static/css/login.css" />
                <title>Shopify App &mdash; Logout</title>
            </Helmet>
            <Redirect to="/login" />
        </div>
    );
}
