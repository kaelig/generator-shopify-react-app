import { EmbeddedApp } from "@shopify/polaris/embedded";
import * as React from "react";
import { config } from "../config";

// This component conditionally includes the EmbeddedApp component based on the enableEmbedded setting in the config
export function EmbeddedAppContainer(props: { children?: any }): JSX.Element {
    if (config.enableEmbedded) {
        const shop = localStorage.getItem(config.shopKey);

        return (
            <EmbeddedApp apiKey={config.shopifyApiKey} shopOrigin={`https://${shop}`} forceRedirect={true}>
                {props.children}
            </EmbeddedApp>
        );

    }

    return props.children;
}
