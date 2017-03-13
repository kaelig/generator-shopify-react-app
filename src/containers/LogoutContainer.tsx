import * as React from "react";
import { InjectedRouter } from "react-router";

import { Logout } from "../components/Logout";

class LogoutContainerProps {
    router?: InjectedRouter;
}

export class LogoutContainer extends React.Component<LogoutContainerProps, undefined> {
    constructor(props: LogoutContainerProps) {
        super(props);
    }

    logout() {
        sessionStorage.removeItem("auth_id");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("shop");
    }

    componentWillReceiveProps(_props: LogoutContainerProps) {
        this.logout();
    }

    componentDidMount(): void {
        this.logout();
    }

    render(): JSX.Element {
        return (<Logout />);
    }
}