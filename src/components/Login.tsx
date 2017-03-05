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
        <section className="zero-state full-width">
            <article>
                <h1>Shopify App — Installation</h1>
                <h3>Please enter the “myshopify” domain of your store</h3>
                <form method="get" style={{ maxWidth: "500px", margin: "auto", padding: "20px" }} onSubmit={props.handleSubmit}>
                    {error}
                    <div className="input-group">
                        <input type="text" name="shop" placeholder="blahblah.myshopify.com" defaultValue={props.shop} onChange={props.handleStoreChanged} />
                        <input type="submit" value="Connect" />
                    </div>
                </form>
            </article>
        </section>
    );
}