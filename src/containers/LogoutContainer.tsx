import * as React from "react";
import { RouteComponentProps } from "react-router";

import { Logout } from "../components/Logout";

export class LogoutContainer extends React.Component<RouteComponentProps<undefined>, undefined> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("shop");
    }

    componentWillReceiveProps(_props: RouteComponentProps<undefined>) {
        this.logout();
    }

    componentDidMount(): void {
        this.logout();
    }

    render(): JSX.Element {
        return (<Logout />);
    }
}