import * as React from "react";
import { InjectedRouter } from "react-router";

import { config } from "../config";

class HomeContainerProps {
    router?: InjectedRouter;
}

export class HomeContainer extends React.Component<HomeContainerProps, undefined> {
    constructor() {
        super();
        this.handleSave = this.handleSave.bind(this);
    }

    handleSave(): void {
        ShopifyApp.Modal.alert("You clicked the 'Save' button", () => { });
    }

    render(): JSX.Element {
        const handleSave = this.handleSave;
        const shop = sessionStorage.getItem("shop");
        if (config.enableEmbedded && config.shopifyApiKey && shop) {
            ShopifyApp.init({
                apiKey: config.shopifyApiKey,
                shopOrigin: `https://${shop}`
            });
            ShopifyApp.ready(function () {
                ShopifyApp.Bar.initialize({
                    icon: "http://localhost:3001/assets/header-icon.png",
                    title: "Shopify React Starter Kit",
                    buttons: {
                        primary: {
                            label: "Save",
                            message: "save",
                            callback: handleSave,
                        },
                        secondary: [
                            {
                                label: "Dashboard",
                                message: "dashboard",
                                href: "/",
                            }
                        ]
                    }
                });
            });
        }

        return (<main>
            <header>
                <h1>Shopify React Starter Kit</h1>
                <h2>Building Shopify Apps powered by React</h2>
            </header>
            <section>
                <div className="column">
                    <article>
                        <div className="card columns twelve align-center" style={{ borderTop: "3px solid rgb(122, 181, 92)" }}>
                            <h2 style={{ color: "rgb(122, 181, 92)" }}>The fast way to build Shopify apps with React</h2>
                            <p>This starter kit makes it easy to get started building embedded Shopify apps using React.</p>
                        </div>
                    </article>
                    <article>
                        <div className="card columns twelve">
                            <h3>The Tech Stack</h3>
                            <ul>
                                <li><a href="https://facebook.github.io/react/">React</a></li>
                                <li><a href="http://www.uptowncss.com/">TypeScript</a></li>
                                <li><a href="https://palantir.github.io/tslint/">TSLint</a></li>
                                <li><a href="http://www.uptowncss.com/">Uptown CSS</a></li>
                            </ul>
                            <p>For more information please see the <a href="https://github.com/buggy/shopify-react-starter">README</a>.</p>
                        </div>
                    </article>
                </div>
            </section>
            <footer></footer>
            <div classID="copyright">
                <p>Shopify Serverless Starter Kit &mdash; &copy; 2017 <a href="http://www.growingecommerce.com/">Growing eCommerce Pty Ltd</a></p>
                <p>Uptown CSS &mdash; &copy; 20176 <a href="http://www.theshoppad.com/">ShopPad, Inc</a></p>
            </div>
        </main>);
    }
}