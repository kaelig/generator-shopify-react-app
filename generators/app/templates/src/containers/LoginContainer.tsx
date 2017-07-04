import * as React from "react";
import { gql, graphql, MutationFunc, QueryProps } from "react-apollo";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";

import { Login } from "../components/Login";
import { config } from "../config";
import { parseQueryString } from "../lib/query-string";

interface ILoginContainerState {
    errorMessage: string | null;
    shop: string;
}

interface IShopifyAuthBeginResponse {
    shopifyAuthBegin: {
        authUrl: string;
        token: string;
    } | null;
}

interface ILoginContainerProps extends RouteComponentProps<{}> {
    data?: QueryProps;
    children?: React.ReactNode;
    mutate: MutationFunc<QueryProps & IShopifyAuthBeginResponse>;
    params: {
        courseId: string;
    };
}

const AuthBeginMutation = gql`
    mutation ShopifyAuthBegin($shop: String!, $callbackUrl: String!, $perUser: Boolean!) {
        shopifyAuthBegin(shop: $shop, callbackUrl: $callbackUrl, perUser: $perUser) {
            authUrl
            token
        }
    }`;

class LoginContainer extends React.Component<ILoginContainerProps, ILoginContainerState> {
    constructor(props: ILoginContainerProps) {
        super(props);
        this.state = {
            errorMessage: null,
            shop: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount(): void {
        this.componentWillReceiveProps(this.props);
    }

    public componentWillReceiveProps(nextProps: ILoginContainerProps): void {
        // Get the shop parameter from the query string
        const params = parseQueryString(nextProps.location.search);
        const shop = params.shop;
        if (shop !== undefined) {
            // Validate the shop domain and set the state
            const errorMessage = this.shopErrorMessage(shop);
            this.setState({
                errorMessage,
                shop,
            });

            // Iff there was no error message the attempt to login
            if (errorMessage === null) {
                this.doLogin(shop);
            }
        }
    }

    // Render the login component
    public render(): JSX.Element {
        if (window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }
        return (
            <div className="application">
                <Helmet>
                    <link rel="stylesheet" href="/static/css/login.css" />
                    <title>Shopify App &mdash; Installation</title>
                </Helmet>
                <Login
                    shop={this.state.shop}
                    handleSubmit={this.handleSubmit}
                    handleStoreChanged={this.handleChange}
                    errorMessage={this.state.errorMessage} />
            </div>
        );
    }

    // Obtain the OAuth URL and redirect the user to it.
    private doLogin(shop: string): void {
        localStorage.setItem(config.shopKey, shop);
        const callbackUrl =
            `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/shopify/callback`;
        this.props.mutate({ variables: { shop, callbackUrl, perUser: false } })
            .then((resp) => {
                if (resp.data.error || resp.data.shopifyAuthBegin === null) {
                    this.setState({
                        errorMessage: "API Call Failed.",
                    });
                    console.error(resp.data.error);
                    return;
                }
                localStorage.setItem(config.authTokenKey, resp.data.shopifyAuthBegin.token);
                // If the current window is the 'parent', change the URL by setting location.href
                if (window.top === window.self) {
                    window.location.href = resp.data.shopifyAuthBegin.authUrl;

                    // If the current window is the 'child', change the parent's URL with postMessage
                } else {
                    const message = JSON.stringify({
                        data: { location: window.location.origin + "?shop=" + shop },
                        message: "Shopify.API.remoteRedirect",
                    });
                    window.parent.postMessage(message, `https://${shop}`);
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    errorMessage: "API Call Failed.",
                });
            });
    }

    // Update our state as the shop component changed
    private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        this.setState({ [event.target.name as keyof ILoginContainerState]: event.target.value } as any);
    }

    // Returns the error message if the shop domain is invalid, otherwise null
    private shopErrorMessage(shop: string): string | null {
        if (shop.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) == null) {
            return "Shop URL must end with .myshopify.com";
        }
        return null;
    }

    // Validate the shop domain and attempt the OAuth process it there is no error
    private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const errorMessage = this.shopErrorMessage(this.state.shop);
        this.setState({
            errorMessage,
        });
        if (errorMessage === null) {
            this.doLogin(this.state.shop);
        }
    }
}

export const LoginContainerWithData = graphql(AuthBeginMutation)(LoginContainer) as React.ComponentClass<any>;