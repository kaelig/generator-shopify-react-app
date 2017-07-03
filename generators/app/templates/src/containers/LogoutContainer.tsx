import * as React from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";

import { config } from "../config";

export function LogoutContainer() {
    // Remove the token and shop from our session storage. These are used by the CheckAuth to determine if someone is
    // logged in
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
