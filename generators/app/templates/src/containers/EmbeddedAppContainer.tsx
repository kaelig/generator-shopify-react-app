import { EmbeddedApp } from "@shopify/polaris/embedded";
import * as React from "react";
import { config } from "../config";

// tslint:disable-next-line:no-namespace
declare namespace ShopifyApp {
    function init(params: any): any;
}

// This component conditionally includes the EmbeddedApp component based on the enableEmbedded setting in the config
export function EmbeddedAppContainer(props: { children?: any }): JSX.Element {
    if (config.enableEmbedded) {
        const shop = localStorage.getItem(config.shopKey);

        // TODO - I'm 99% sure this shouldn't be required. It looks like the EmbeddedApp component doesn't cause the
        // page to load inside the Shopify Admin the way this does. See https://github.com/Shopify/polaris/issues/28
        ShopifyApp.init({
            apiKey: config.shopifyApiKey,
            shopOrigin: `https://${shop}`,
        });

        return (
            <EmbeddedApp apiKey={config.shopifyApiKey} shopOrigin={`https://${shop}`}>
                {props.children}
            </EmbeddedApp>
        );

    }

    return props.children;
}
