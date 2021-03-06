import * as React from "react";

interface ICallbackProps {
    errorMessage: string | null;
}

export function Callback(props: ICallbackProps) {
    const error = props.errorMessage ? <div className="container__form">ERROR: {props.errorMessage}</div> : null;
    return (
        <main className="container" role="main">
            <header>
                <h1>Shopify App — Installation</h1>
                <p className="subhead">
                    <label htmlFor="shop">Redirecting, please wait...</label>
                </p>
            </header>

            {error}
        </main>
    );
}
