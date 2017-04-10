import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import "whatwg-fetch";

import { config } from "../config";
import { parseQueryString } from "../lib/query-string";
import { Callback } from "../components/Callback";

class CallbackContainerState {
    callbackSuccess: boolean;
    errorMessage: string | null;
    shop: string | null;
}

export class CallbackContainer extends React.Component<RouteComponentProps<undefined>, CallbackContainerState> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
        const shop = new URLSearchParams(this.props.location.search).get("shop");
        this.state = {
            callbackSuccess: false,
            errorMessage: null,
            shop: shop
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(): void {
        this.doCallback(parseQueryString(this.props.location.search), sessionStorage.getItem("token"));
    }

    componentWillReceiveProps(nextProps: RouteComponentProps<undefined>): void {
        this.doCallback(parseQueryString(nextProps.location.search), sessionStorage.getItem("token"));
    }

    doCallback(querystring: { [name: string]: string }, token: string | null): void {
        const params = Object.assign({}, querystring, { token: token });
        const url = `${config.baseApiUrl}/auth/shopify`;
        fetch(url, { method: "POST", mode: "cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                        .then(json => {
                            sessionStorage.setItem("token", json["token"]);
                            this.setState({
                                callbackSuccess: true
                            })
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
        this.setState({ [event.target.name as keyof CallbackContainerState]: event.target.value } as any);
    }

    render(): JSX.Element {
        if (this.state.callbackSuccess) {
            return <Redirect to="/" />;
        }

        return (<Callback errorMessage={this.state.errorMessage} />);
    }
}