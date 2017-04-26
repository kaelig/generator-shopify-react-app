import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import "whatwg-fetch";

import { config } from "../config";
import { parseQueryString } from "../lib/query-string";
import { Callback } from "../components/Callback";

class CallbackContainerState {
    callbackSuccess: boolean;
    errorMessage: string | null;
}

export class CallbackContainer extends React.Component<RouteComponentProps<undefined>, CallbackContainerState> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
        this.state = {
            callbackSuccess: false,
            errorMessage: null,
        };
    }

    // Perform the callback when we mount
    componentDidMount(): void {
        this.doCallback(parseQueryString(this.props.location.search), sessionStorage.getItem("token"));
    }

    // Perform the callback when we receive new properties
    componentWillReceiveProps(nextProps: RouteComponentProps<undefined>): void {
        this.setState({
            callbackSuccess: false,
            errorMessage: null
        });
        this.doCallback(parseQueryString(nextProps.location.search), sessionStorage.getItem("token"));
    }

    // This calls our API passing all of the query string parameters plus the token we receive when we started the
    // OAuth process. If it succeeds then set callbackSuccess to true triggering a redirect. If it fails then set
    // the errorMessage in the state so we display an error
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
                            });
                        })
                        .catch(err => {
                            console.error("Unexpected error calling resp.json()", err);
                            this.setState({ errorMessage: "OAuth Callback Failed" });
                        });
                } else {
                    console.error("Fetch resp.ok was false");
                    this.setState({ errorMessage: "OAuth Callback Failed" });
                }
            })
            .catch(err => {
                console.error("Unexpected error calling fetch()", err);
                this.setState({ errorMessage: "OAuth Callback Failed" });
            });
    }

    // This first time this is called it will render "Please wait..." while the API call is performed. If that
    // is successfull then we'll redirect to / otherwise we'll update the page to display the errorMessage
    render(): JSX.Element {
        if (this.state.callbackSuccess) {
            return <Redirect to="/" />;
        }

        return (
            <div className="application">
                <Helmet>
                    <link rel="stylesheet" href="/static/css/login.css" />
                    <title>Shopify App &mdash; Callback</title>
                </Helmet>
                <Callback errorMessage={this.state.errorMessage} />
            </div>
        );
    }
}