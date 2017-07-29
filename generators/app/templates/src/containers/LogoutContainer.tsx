import * as React from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";

import { AUTH_TOKEN_KEY, SHOP_KEY, TOKEN_KEY } from "../constants";

export function LogoutContainer() {
    // Remove the token and shop from our session storage. These are used by the CheckAuth to determine if someone is
    // logged in
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SHOP_KEY);

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
