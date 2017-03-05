import * as React from "react";

class CallbackProps {
    errorMessage: string | null;
}

export function Callback(props: CallbackProps) {
    const error = props.errorMessage ? <div className="alert error"><dl><dt>Error Alert</dt><dd>{props.errorMessage}</dd></dl></div> : null;
    return (
        <section className="zero-state full-width">
            <article>
                <h1>Shopify App — Installation</h1>
                {error}
            </article>
        </section>
    );
}