import * as React from "react";
import { Link } from "react-router";

export function Logout() {
    return (
        <section className="zero-state full-width">
            <article>
                <h1>Logged Out</h1>
                <h3>You are now logged out.</h3>
                <Link to="/" className="button">Login Again</Link>
            </article>
        </section>
    );
}