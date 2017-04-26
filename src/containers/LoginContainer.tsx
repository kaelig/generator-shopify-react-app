import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import "whatwg-fetch";

import { config } from "../config";
import { parseQueryString } from "../lib/query-string";
import { Login } from "../components/Login";

class LoginContainerState {
    errorMessage: string | null;
    shop: string;
}

export class LoginContainer extends React.Component<RouteComponentProps<undefined>, LoginContainerState> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
        this.state = {
            errorMessage: null,
            shop: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(): void {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps: RouteComponentProps<undefined>): void {
        // Get the shop parameter from the query string
        const params = parseQueryString(nextProps.location.search);
        const shop = params["shop"];
        if (shop !== undefined) {
            // Validate the shop domain and set the state
            const errorMessage = this.shopErrorMessage(shop);
            this.setState({
                errorMessage: errorMessage,
                shop: shop
            });

            // Iff there was no error message the attempt to login
            if (errorMessage === null) {
                this.doLogin(shop);
            }
        }
    }

    // Obtain the OAuth URL and redirect the user to it.
    doLogin(shop: string): void {
        sessionStorage.setItem("shop", shop);
        const callbackUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/shopify/callback`;
        const url = `${config.baseApiUrl}/auth/shopify?shop=${encodeURI(shop)}&callbackUrl=${encodeURI(callbackUrl)}`;
        console.log(url);
        fetch(url, { method: "GET", mode: "cors" })
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                        .then(json => {
                            sessionStorage.setItem("token", json["token"]);
                            // If the current window is the 'parent', change the URL by setting location.href
                            if (window.top === window.self) {
                                window.location.href = json["authUrl"];

                                // If the current window is the 'child', change the parent's URL with postMessage
                            } else {
                                let message = JSON.stringify({
                                    message: "Shopify.API.remoteRedirect",
                                    data: { location: window.location.origin + "?shop=" + shop }
                                });
                                window.parent.postMessage(message, `https://${shop}`);
                            }
                        })
                        .catch(err => console.error("Unexpected error calling resp.json()", err));
                } else {
                    this.setState({ errorMessage: "OAuth Begin Failed" });
                }
            })
            .catch(err => {
                console.error("Unexpected error calling fetch()", err);
                this.setState({ errorMessage: "OAuth Begin Failed" });
            });
    }

    // Update our state as the shop component changed
    handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        this.setState({ [event.target.name as keyof LoginContainerState]: event.target.value } as any);
    }

    // Returns the error message if the shop domain is invalid, otherwise null
    shopErrorMessage(shop: string): string | null {
        if (shop.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) == null) {
            return "Shop URL must end with .myshopify.com";
        }
        return null;
    }

    // Validate the shop domain and attempt the OAuth process it there is no error
    handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const errorMessage = this.shopErrorMessage(this.state.shop);
        this.setState({
            errorMessage: errorMessage
        });
        if (errorMessage === null) {
            this.doLogin(this.state.shop);
        }
    }

    // Render the login component
    render(): JSX.Element {
        if (window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }
        return (
            <div className="application">
                <Helmet>
                    <link rel="stylesheet" href="/static/css/login.css" />
                    <title>Shopify App &mdash Installation</title>
                </Helmet>
                <Login shop={this.state.shop} handleSubmit={this.handleSubmit} handleStoreChanged={this.handleChange} errorMessage={this.state.errorMessage} />
            </div>
        );
    }
}