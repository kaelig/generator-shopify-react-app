import * as React from "react";
import { InjectedRouter } from "react-router";
import "whatwg-fetch";

import { config } from "../config";
import { Callback } from "../components/Callback";

class CallbackContainerProps {
    location: {
        query: {
            [name: string]: string;
        };
    };
    router?: InjectedRouter;
}

class CallbackContainerState {
    errorMessage: string | null;
    shop: string | null;
}

export class CallbackContainer extends React.Component<CallbackContainerProps, CallbackContainerState> {
    constructor(props: CallbackContainerProps) {
        super(props);
        this.state = {
            errorMessage: null,
            shop: this.props["location"]["query"]["shop"]
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(): void {
        this.doCallback(this.props.location.query, sessionStorage.getItem("auth_id"));
    }

    componentWillReceiveProps(nextProps: CallbackContainerProps): void {
        this.doCallback(nextProps.location.query, sessionStorage.getItem("auth_id"));
    }

    doCallback(querystring: { [name: string]: string }, token: string | null): void {
        const params = Object.assign({}, querystring, { token: token });
        const url = `${config.baseApiUrl}/auth/shopify`;
        fetch(url, { method: 'POST', mode: 'cors', headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                        .then(json => {
                            sessionStorage.setItem("token", json["token"]);
                            if (this.props.router) {
                                this.props.router.push("/");
                            }
                        })
                        .catch(err => console.error("Unexpected error calling resp.json()", err));
                } else {
                    this.setState({ errorMessage: "OAuth Callback Failed" });
                }
            })
            .catch(err => {
                console.error("Unexpected error calling fetch()", err)
                this.setState({ errorMessage: "OAuth Callback Failed" });
            });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        this.setState({ [event.target.name as keyof CallbackContainerState]: event.target.value } as any);
    }

    render(): JSX.Element {
        return (<Callback errorMessage={this.state.errorMessage} />);
    }
}