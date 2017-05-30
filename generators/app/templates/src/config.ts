export const config = {
    // Your Shopify API Key
    shopifyApiKey: "<%= shopifyapikey %>",

    // The base URL for our API endpoint
    baseApiUrl: "<%= graphqlapi %>",

    // Set to true to enable an embedded app or false to disable it
    enableEmbedded: true,

    // The key used to store our API authorization token in localStorage
    tokenKey: "token",

    // The key used to store our temporary OAuth token in localStorage
    authTokenKey: "authToken",

    // The key used to store the shop domain in localStorage
    shopKey: "shop"
};
