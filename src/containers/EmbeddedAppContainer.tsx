import * as React from "react";
import { EmbeddedApp } from "@shopify/polaris/embedded";

import { config } from "../config";

declare namespace ShopifyApp {
    function init(params: any): any;
}

export function EmbeddedAppContainer(props: { children?: any }): JSX.Element {
    if (config.enableEmbedded) {
        const shop = sessionStorage.getItem("shop");

        ShopifyApp.init({
            apiKey: config.shopifyApiKey,
            shopOrigin: `https://${shop}`
        });

        return (
            <EmbeddedApp apiKey={config.shopifyApiKey} shopOrigin={`https://${shop}`}>
                {props.children}
            </EmbeddedApp>
        );

    }

    return props.children;
}