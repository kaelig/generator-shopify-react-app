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

    componentDidMount(): void {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token");
        if (this.props.router) {
            this.props.router.push("/");
        }
    }

    render(): JSX.Element {
        return (<Logout />);
    }
}