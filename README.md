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
yo shopify-react-app --appname "YOUR APP NAME" --shopifyApiKey "YOUR-API-KEY" --graphqlApiUrl "https://YOUR-SITE/graphql"
```

# Dependencies
Once you've generated the app you need to install the dependencies. All of the depencies are in the generated `package.json` file. You can install them using:

```sh
npm install
```

# Configuration
Your configuration is stored in the `src/constants.ts` file. If you filled in these correctly when running the generator then you can skip this.

```typescript
// The key used to store our temporary OAuth token in localStorage
export const AUTH_TOKEN_KEY = "authToken";

// The base URL for our API endpoint
export const BASE_API_URL = "YOUR-GRAPHQL-API-ENDPOINT";

// Set to true to enable an embedded app or false to disable it
export const ENABLED_EMBEDDED = true;

// The key used to store the shop domain in localStorage
export const SHOP_KEY = "shop";

// Your Shopify API Key
export const SHOPIFY_API_KEY = "YOUR-SHOPIFY-API-KEY";

// The key used to store our API authorization token in localStorage
export const TOKEN_KEY = "token";
```

# Development Server
This project uses the [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html). You can start it by running the following command from the projects root folder

```sh
npm start
```

Once the development server has started go to [https://localhost:5001/login](https://localhost:5001/login) to login. This URL also accepts the `shop` query string parameter.

# Generating schema.ts
You may notice that the type definitions for the GraphQL API endpoint are in a file called `src/schema.ts`. This file is automatically generated from your GraphQL API endpoint. To update it you need to modify your `package.json` and replace `YOUR-GRAPHQL-API-ENDPOINT` with your actual endpoint.

After doing that you can run the following command to rebuild `src/schema.ts` based off your actual GraphQL API endpoint and the GraphQL queries inside `src/graphql`.

```sh
npm run refresh:schema
```

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