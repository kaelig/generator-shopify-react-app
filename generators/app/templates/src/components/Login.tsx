import * as React from "react";

class LoginProps {
    handleSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>;
    handleStoreChanged: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
    errorMessage: string | null;
    shop: string;
}

export function Login(props: LoginProps) {
    const error = props.errorMessage ? <div className="alert error"><dl><dt>Error Alert</dt><dd>{props.errorMessage}</dd></dl></div> : null;
    return (
        <main className="container" role="main">
            <header>
                <h1>Shopify App — Installation</h1>
                <p className="subhead">
                    <label htmlFor="shop">Please enter the “myshopify” domain of your store</label>
                </p>
            </header>

            <div className="container__form">
                {error}
                <form method="GET" action="login" onSubmit={props.handleSubmit}>
                    <input type="text" name="shop" placeholder="example.myshopify.com" defaultValue={props.shop} onChange={props.handleStoreChanged} />
                    <button type="submit">Install</button>
                </form>
            </div>
        </main>
    );
}