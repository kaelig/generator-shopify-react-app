# Shopify React App Generator for Yeoman
Yeoman is a scaffolding system for quickly creating many kinds of apps. This Yeoman generator creates a [Shopify](https://www.shopify.com/?ref=growingecommerce) App using React & Polaris for a GraphQL backend provided by [Shopify Serverless Starter Kit](https://github.com/buggy/shopify-serverless-starter). If you don't want to use a Serverless backend you can build your own GraphQL backend using any language/framework if you prefer.

# Installing
To use this starter kit you need to install Yeoman. If you don't already have Yeoman installed then run

```sh
npm install yeoman -g
```

You should then install the Shopify React Starter generator for Yeoman

```sh
npm install generator-shopify-react-app
```

Finally you can generate a new starter app in the current directory by using

```sh
yo shopify-react-app
```

This will prompt you to enter your application name, Shopify API key and GraphQL endpoint. You can also provide parameters on the command line using

``ssh
yo shopify-react-app --appname "YOUR APP NAME" --shopifyapikey "YOUR-API-KEY" --graphqlapi "https://YOUR-SITE/graphql"
```

# Dependencies
Once you've generated the app you need to install the dependencies. All of the depencies are in the generated `package.json` file. You can install them using:

```sh
npm install
```

# Configuration
Your configuration is stored in the `src/config.ts` file. If you filled in these correctly when running the generator then you can skip this.

```typescript
export const config = {
    // Your Shopify API Key
    shopifyApiKey: "YOUR-API-KEY",

    // The base URL for our API endpoint
    baseApiUrl: "https://api.example.com/graphql",

    // Set to true to enable an embedded app or false to disable it
    enableEmbedded: true,

    // The key used to store our API authorization token in localStorage
    tokenKey: "token",

    // The key used to store our temporary OAuth token in localStorage
    authTokenKey: "authToken",

    // The key used to store the shop domain in localStorage
    shopKey: "shop"
}
```

# Development Server
This project uses the webpack-dev-server. You can start it by running the following command from the projects root folder

```sh
npm start
```

Once the development server has started go to [https://localhost:5001/login](https://localhost:5001/login to login)

# GraphQL API

If you are building your own GraphQL API it needs to respond to two mutations.

The first mutation is called to begin the Shopify OAuth process. The mutation accepts the shop hostname, a callback URL (where the user is redirected after they have approved installation of the app) and whether the authentication is per user. This is enough information to generate the URL the user should be redirected to when starting the OAuth process.

The mutation needs to return an object with an `authUrl` that the user will be redirected to and a `token` that will be stored locally and sent with the mutation called to complete the OAuth process. The `token` provides state between API calls so the OAuth nonce parameter can be verified.

```graphql
mutation ShopifyAuthBegin($shop: String!, $callbackUrl: String!, $perUser: Boolean!) {
    shopifyAuthBegin(shop: $shop, callbackUrl: $callbackUrl, perUser: $perUser) {
        authUrl
        token
    }
}`;
```

After the user has complete OAuth and approved installation of the application they will be redirected to the `callbackUrl` you provided earlier. This page should call a second mutation to complete the OAuth process. The second mutation also takes two parameters. `token` is the token returned by the `shopifyAuthBegin()` mutation called earlier. `params` is an object containing the `code`, `hmac`, `shop`, `state` and `timestamp` parameters that Shopify added to the callback URL.

This mutation should return an object with another `token` that can be used for future API requests to the GraphQL API. This is different from the token returned by `shopifyAuthBegin()` and should not be the access token from Shopify.

```graphql
mutation ShopifyAuthComplete($token: String!, $params: ShopifyAuthCompleteInput!) {
    shopifyAuthComplete(token: $token, params: $params) {
        token
    }
}`;
```

# Copyright
This project copyright 2017 Rich Buggy & [Growing eCommerce Pty Ltd](http://www.growingecommerce.com). See the LICENCE file for information about using and distributing this project.