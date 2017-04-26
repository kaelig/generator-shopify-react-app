import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";

export class LogoutContainer extends React.Component<RouteComponentProps<undefined>, undefined> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("shop");
    }

    componentWillReceiveProps(_props: RouteComponentProps<undefined>) {
        this.logout();
    }

    componentDidMount(): void {
        this.logout();
    }

    render(): JSX.Element {
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
}