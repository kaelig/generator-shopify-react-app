import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { CallbackContainer } from "../containers/CallbackContainer";
import { CheckAuthContainer } from "../containers/CheckAuthContainer";
import { EmbeddedAppContainer } from "../containers/EmbeddedAppContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainer } from "../containers/LoginContainer";
import { LogoutContainer } from "../containers/LogoutContainer";

export class App extends React.Component<{}, {}> {

    render(): JSX.Element {
        return (
            <Router>
                <Switch>
                    <Route path="/login" component={LoginContainer} />
                    <Route path="/logout" component={LogoutContainer} />
                    <Route path="/auth/shopify/callback" component={CallbackContainer} />
                    <CheckAuthContainer>
                        <EmbeddedAppContainer>
                            <Switch>
                                <Route path="/" component={HomeContainer} />
                            </Switch>
                        </EmbeddedAppContainer>
                    </CheckAuthContainer>
                </Switch>
            </Router>
        );
    }
}