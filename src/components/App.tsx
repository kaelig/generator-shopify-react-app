import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";

import { CallbackContainer } from "../containers/CallbackContainer";
import { CheckAuth } from "../components/CheckAuth";
import { EmbeddedAppContainer } from "../containers/EmbeddedAppContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainer } from "../containers/LoginContainer";
import { LogoutContainer } from "../containers/LogoutContainer";
import { config } from "../config";

// Create a network interface with the config for our GraphQL API
const networkInterface = createNetworkInterface({
    uri: config.baseApiUrl
});

// Automatically add the token from localStorage as the Authorization header
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {};  // Create the header object if needed.
        }
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem(config.tokenKey);
        req.options.headers.authorization = token ? `Bearer ${token}` : null;
        next();
    }
}]);

// Create an Apollo client
const client = new ApolloClient({
    networkInterface,
    dataIdFromObject: (o: any) => o.id
});

// This is the routing for our app. /login, /logout and /auth/shopify/callback should all be unauthenticated. The
// rest of the app should check that the user is authenticated and initialize the embedded app code if enabled
export class App extends React.Component<{}, {}> {
    render(): JSX.Element {
        return (
            <ApolloProvider client={client}>
                <Router>
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
                </Router>
            </ApolloProvider>
        );
    }
}