import * as React from "react";
import { Router, Route, browserHistory, RouterState, RedirectFunction } from "react-router";

import { CallbackContainer } from "../containers/CallbackContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainer } from "../containers/LoginContainer";
import { LogoutContainer } from "../containers/LogoutContainer";

export class App extends React.Component<{}, {}> {
    checkAuth(_nextState: RouterState, replace: RedirectFunction) {
        const token = sessionStorage.getItem("token");
        const shop = sessionStorage.getItem("shop");
        if (!token || !shop) {
            replace("/login");
        }
    }

    render(): JSX.Element {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={HomeContainer} onEnter={this.checkAuth} />
                <Route path="/login" component={LoginContainer} />
                <Route path="/logout" component={LogoutContainer} />
                <Route path="/auth/shopify/callback" component={CallbackContainer} />
            </Router>
        );
    };
}