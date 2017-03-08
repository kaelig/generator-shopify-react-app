import * as React from "react";
import { InjectedRouter } from "react-router";

import { config } from "../config";

class HomeContainerProps {
    router?: InjectedRouter;
}

export class HomeContainer extends React.Component<HomeContainerProps, undefined> {
    constructor() {
        super();
    }

    render(): JSX.Element {
        if (config.enableEmbedded) {
            ShopifyApp.init({
                apiKey: config.shopifyApiKey,
                shopOrigin: 'https://growing-ecommerce.myshopify.com'
            });
            ShopifyApp.ready(function () {
                ShopifyApp.Bar.initialize({
                    icon: 'http://localhost:3001/assets/header-icon.png',
                    title: 'Promotable Welcome Bar',
                    buttons: {
                        primary: {
                            label: 'Save',
                            message: 'save',
                            href: '/settings'
                        },
                        secondary: [
                            {
                                label: 'Dashboard',
                                message: 'dashboard',
                                href: '/',
                            }
                        ]
                    }
                });
            });
        }

        return (<div>
            <h1>Home Sweet Home</h1>
        </div>);
    }
}