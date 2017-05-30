import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import { gql, graphql } from "react-apollo";

import { parseQueryString } from "../lib/query-string";
import { Login } from "../components/Login";
import {config } from "../config";

class LoginContainerState {
    errorMessage: string | null;
    shop: string;
}

interface ShopifyAuthBeginResponse {
    data: {
        shopifyAuthBegin: {
            authUrl: string;
            token: string;
        } | null;
    };
    errors?: [ { Error: string; }];
}

interface LoginContainerProps extends RouteComponentProps<{}> {
    data: {
        loading: boolean;
        error: object;
    };
    mutate: (params: { variables: { shop: string, callbackUrl: string, perUser: boolean } }) => Promise<ShopifyAuthBeginResponse>;
}

const AuthBeginMutation = gql`
    mutation ShopifyAuthBegin($shop: String!, $callbackUrl: String!, $perUser: Boolean!) {
        shopifyAuthBegin(shop: $shop, callbackUrl: $callbackUrl, perUser: $perUser) {
            authUrl
            token
        }
    }`;

@graphql(AuthBeginMutation)
export class LoginContainer extends React.Component<LoginContainerProps, LoginContainerState> {
    constructor(props: LoginContainerProps) {
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

    componentWillReceiveProps(nextProps: LoginContainerProps): void {
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
        localStorage.setItem(config.shopKey, shop);
        const callbackUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/shopify/callback`;
        this.props.mutate({ variables: { shop, callbackUrl, perUser: false } })
            .then((resp: ShopifyAuthBeginResponse) => {
                if (resp.errors || resp.data.shopifyAuthBegin === null) {
                    this.setState({
                        errorMessage: "API Call Failed."
                    });
                    console.error(resp.errors);
                    return;
                }
                localStorage.setItem(config.authTokenKey, resp.data.shopifyAuthBegin.token);
                // If the current window is the 'parent', change the URL by setting location.href
                if (window.top === window.self) {
                    window.location.href = resp.data.shopifyAuthBegin.authUrl;

                    // If the current window is the 'child', change the parent's URL with postMessage
                } else {
                    let message = JSON.stringify({
                        message: "Shopify.API.remoteRedirect",
                        data: { location: window.location.origin + "?shop=" + shop }
                    });
                    window.parent.postMessage(message, `https://${shop}`);
                }
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMessage: "API Call Failed."
                });
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
                    <title>Shopify App &mdash; Installation</title>
                </Helmet>
                <Login shop={this.state.shop} handleSubmit={this.handleSubmit} handleStoreChanged={this.handleChange} errorMessage={this.state.errorMessage} />
            </div>
        );
    }
}