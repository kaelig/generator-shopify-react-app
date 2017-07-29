import * as React from "react";
import { gql, graphql, MutationFunc, QueryProps } from "react-apollo";
import { Helmet } from "react-helmet";
import { Redirect, RouteComponentProps } from "react-router-dom";

import { Callback } from "../components/Callback";
import { AUTH_TOKEN_KEY, TOKEN_KEY } from "../constants";
import { parseQueryString } from "../lib/query-string";

interface ICallbackContainerState {
    callbackSuccess: boolean;
    errorMessage: string | null;
}

interface IShopifyAuthCompleteInput {
    code: string;
    hmac: string;
    shop: string;
    state: string;
    timestamp: string;
}

interface IShopifyAuthCompleteResponse {
    shopifyAuthComplete: {
        token: string;
    } | null;
}

interface ICallbackContainerProps extends RouteComponentProps<{}> {
    data?: QueryProps & {
        loading: boolean;
        error: object;
    };
    children?: React.ReactNode;
    mutate: MutationFunc<QueryProps & IShopifyAuthCompleteResponse>;
    params: {
        courseId: string;
    };
}

const AuthCompleteMutation = gql`
    mutation ShopifyAuthComplete($token: String!, $params: ShopifyAuthCompleteInput!) {
        shopifyAuthComplete(token: $token, params: $params) {
            token
        }
    }`;

class CallbackContainer extends React.Component<ICallbackContainerProps, ICallbackContainerState> {
    constructor(props: ICallbackContainerProps) {
        super(props);
        this.state = {
            callbackSuccess: false,
            errorMessage: null,
        };
    }

    // Perform the callback when we mount
    public componentDidMount(): void {
        this.doCallback(parseQueryString(this.props.location.search), localStorage.getItem(AUTH_TOKEN_KEY));
    }

    // Perform the callback when we receive new properties
    public componentWillReceiveProps(nextProps: ICallbackContainerProps): void {
        this.setState({
            callbackSuccess: false,
            errorMessage: null,
        });
        this.doCallback(parseQueryString(nextProps.location.search), localStorage.getItem(AUTH_TOKEN_KEY));
    }

    // This first time this is called it will render "Please wait..." while the API call is performed. If that
    // is successfull then we'll redirect to / otherwise we'll update the page to display the errorMessage
    public render(): JSX.Element {
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

    // This calls our API passing all of the query string parameters plus the token we receive when we started the
    // OAuth process. If it succeeds then set callbackSuccess to true triggering a redirect. If it fails then set
    // the errorMessage in the state so we display an error
    private doCallback(querystring: { [name: string]: string }, token: string | null): void {
        if (token === null) {
            this.setState({ errorMessage: "Missing token" });
            return;
        }

        const params: IShopifyAuthCompleteInput = {
            code: querystring.code,
            hmac: querystring.hmac,
            shop: querystring.shop,
            state: querystring.state,
            timestamp: querystring.timestamp,
        };
        this.props.mutate({ variables: { token, params } })
            .then((resp) => {
                if (resp.data.error || resp.data.shopifyAuthComplete === null) {
                    this.setState({
                        errorMessage: "API Call Failed.",
                    });
                    return;
                }
                localStorage.setItem(TOKEN_KEY, resp.data.shopifyAuthComplete.token);
                this.setState({
                    callbackSuccess: true,
                });
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    errorMessage: "API Call Failed.",
                });
            });
    }
}

export const CallbackContainerWithData = graphql(AuthCompleteMutation)(CallbackContainer) as React.ComponentClass<any>;
