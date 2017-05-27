import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { gql, graphql } from "react-apollo";

import { parseQueryString } from "../lib/query-string";
import { Callback } from "../components/Callback";
import { config } from "../config";

class CallbackContainerState {
    callbackSuccess: boolean;
    errorMessage: string | null;
}

interface ShopifyAuthCompleteInput {
    code: string;
    hmac: string;
    shop: string;
    state: string;
    timestamp: string;
}

interface ShopifyAuthCompleteResponse {
    data: {
        shopifyAuthComplete: {
            token: string;
        } | null;
    };
    errors?: [{ Error: string; }];
}

interface CallbackContainerProps extends RouteComponentProps<{}> {
    data: {
        loading: boolean;
        error: object;
    };
    mutate: (params: { variables: { token: string, params: ShopifyAuthCompleteInput } }) => Promise<ShopifyAuthCompleteResponse>;
}

const AuthCompleteMutation = gql`
    mutation ShopifyAuthComplete($token: String!, $params: ShopifyAuthCompleteInput!) {
        shopifyAuthComplete(token: $token, params: $params) {
            token
        }
    }`;

@graphql(AuthCompleteMutation)
export class CallbackContainer extends React.Component<CallbackContainerProps, CallbackContainerState> {
    constructor(props: CallbackContainerProps) {
        super(props);
        this.state = {
            callbackSuccess: false,
            errorMessage: null,
        };
    }

    // Perform the callback when we mount
    componentDidMount(): void {
        this.doCallback(parseQueryString(this.props.location.search), localStorage.getItem(config.authTokenKey));
    }

    // Perform the callback when we receive new properties
    componentWillReceiveProps(nextProps: CallbackContainerProps): void {
        this.setState({
            callbackSuccess: false,
            errorMessage: null
        });
        this.doCallback(parseQueryString(nextProps.location.search), localStorage.getItem(config.authTokenKey));
    }

    // This calls our API passing all of the query string parameters plus the token we receive when we started the
    // OAuth process. If it succeeds then set callbackSuccess to true triggering a redirect. If it fails then set
    // the errorMessage in the state so we display an error
    doCallback(querystring: { [name: string]: string }, token: string | null): void {
        if (token === null) {
            this.setState({ errorMessage: "Missing token" });
            return;
        }

        const params: ShopifyAuthCompleteInput = {
            code: querystring["code"],
            hmac: querystring["hmac"],
            shop: querystring["shop"],
            state: querystring["state"],
            timestamp: querystring["timestamp"]
        };
        this.props.mutate({ variables: { token, params } })
            .then((resp: ShopifyAuthCompleteResponse) => {
                if (resp.errors || resp.data.shopifyAuthComplete === null) {
                    this.setState({
                        errorMessage: "API Call Failed."
                    });
                    return;
                }
                localStorage.setItem(config.tokenKey, resp.data.shopifyAuthComplete.token);
                this.setState({
                    callbackSuccess: true
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMessage: "API Call Failed."
                });
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