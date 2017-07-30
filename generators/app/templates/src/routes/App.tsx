import * as React from "react";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";

import { CheckAuth } from "../components/CheckAuth";
import { CallbackContainerWithData } from "../containers/CallbackContainer";
import { EmbeddedAppContainer } from "../containers/EmbeddedAppContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainerWithData } from "../containers/LoginContainer";
import { LogoutContainer } from "../containers/LogoutContainer";

import { BASE_API_URL, SHOP_KEY, TOKEN_KEY } from "../constants";

// Create a network interface with the config for our GraphQL API
const networkInterface = createNetworkInterface({
    uri: BASE_API_URL,
});

// Automatically add the token from localStorage as the Authorization header
networkInterface.use([{
    applyMiddleware(req, next) {
        const token = localStorage.getItem(TOKEN_KEY);
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

// Create the redux store
const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
      applyMiddleware(client.middleware()),
      // If you are using the devToolsExtension, you can add it here also
  ),
);

// This is the routing for our app. /login, /logout and /auth/shopify/callback should all be unauthenticated. The
// rest of the app should check that the user is authenticated and initialize the embedded app code if enabled
export class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        const shop = localStorage.getItem(SHOP_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        return (
            <ApolloProvider client={client} store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={LoginContainerWithData} />
                        <Route path="/logout" component={LogoutContainer} />
                        <Route path="/auth/shopify/callback" component={CallbackContainerWithData} />
                        <CheckAuth shop={shop} token={token}>
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
