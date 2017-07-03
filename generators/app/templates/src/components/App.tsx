import * as React from "react";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { CheckAuth } from "../components/CheckAuth";
import { CallbackContainer } from "../containers/CallbackContainer";
import { EmbeddedAppContainer } from "../containers/EmbeddedAppContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainer } from "../containers/LoginContainer";
import { LogoutContainer } from "../containers/LogoutContainer";

import { config } from "../config";

// Create a network interface with the config for our GraphQL API
const networkInterface = createNetworkInterface({
    uri: config.baseApiUrl,
});

// Automatically add the token from localStorage as the Authorization header
networkInterface.use([{
    applyMiddleware(req, next) {
        const token = localStorage.getItem(config.tokenKey);
        if (token) {
            if (!req.options.headers) {
                req.options.headers = {};  // Create the header object if needed.
            }
            // get the authentication token from local storage if it exists
            req.options.headers.authorization = `Bearer ${token}`;
        }
        next();
    },
}]);

// Create an Apollo client
const client = new ApolloClient({
    dataIdFromObject: (o: any) => o.id,
    networkInterface,
});

// This is the routing for our app. /login, /logout and /auth/shopify/callback should all be unauthenticated. The
// rest of the app should check that the user is authenticated and initialize the embedded app code if enabled
export class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={LoginContainer} />
                        <Route path="/logout" component={LogoutContainer} />
                        <Route path="/auth/shopify/callback" component={CallbackContainer} />
                        <CheckAuth>
                            <EmbeddedAppContainer>
                                <Switch>
                                    <Route path="/" component={HomeContainer} />
                                </Switch>
                            </EmbeddedAppContainer>
                        </CheckAuth>
                    </Switch>
                </BrowserRouter>
            </ApolloProvider>
        );
    }
}
