import * as React from "react";
import "whatwg-fetch";

import { config } from "../config";
import { Login } from "../components/Login";

class LoginContainerProps {
    location: {
        query: {
            shop: string;
        }
    };
    router?: {
        params: {
            [name: string]: string;
        }
    };
}

class LoginContainerState {
    errorMessage: string | null;
    shop: string;
}

export class LoginContainer extends React.Component<LoginContainerProps, LoginContainerState> {
    constructor(props: LoginContainerProps) {
        super(props);
        this.state = {
            errorMessage: null,
            shop: this.props["location"]["query"]["shop"] || ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(): void {
        if (this.props.location.query["shop"] !== undefined) {
            this.setState({ shop: this.props.location.query["shop"] });
            this.doLogin(this.props.location.query["shop"]);
        }
    }

    componentWillReceiveProps(nextProps: LoginContainerProps): void {
        if (nextProps.location.query["shop"] !== undefined) {
            this.setState({ shop: this.props.location.query["shop"] });
            this.doLogin(nextProps.location.query["shop"]);
        }
    }

    doLogin(shop: string): void {
        sessionStorage.setItem("shop", shop);
        const callbackUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/shopify/callback`;
        const url = `${config.baseApiUrl}/auth/shopify?shop=${encodeURI(shop)}&callbackUrl=${encodeURI(callbackUrl)}`;
        fetch(url, { method: "GET", mode: "cors" })
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                        .then(json => {
                            sessionStorage.setItem("auth_id", json["token"]);
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
                    this.setState({ errorMessage: "OAuth Callback Failed" });
                }
            })
            .catch(err => {
                console.error("Unexpected error calling fetch()", err);
                this.setState({ errorMessage: "OAuth Callback Failed" });
            });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        this.setState({ [event.target.name as keyof LoginContainerState]: event.target.value } as any);
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (this.state.shop.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) == null) {
            this.setState({
                errorMessage: "Shop URL must end with .myshopify.com"
            });
            return;
        } else {
            this.setState({
                errorMessage: null
            });
        }
        this.doLogin(this.state.shop);
    }

    render(): JSX.Element {
        if (window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }
        return (<Login shop={this.state.shop} handleSubmit={this.handleSubmit} handleStoreChanged={this.handleChange} errorMessage={this.state.errorMessage} />);
    }
}