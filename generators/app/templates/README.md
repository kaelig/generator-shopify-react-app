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

If don't want to enter parameters via the prompt you can add them to the command line

``ssh
yo shopify-react-app --appname "YOUR APP NAME" --shopifyapikey "YOUR-API-KEY" --graphqlapi "https://YOUR-SITE/graphql"
```

# Dependencies
Once you've generated the app you need to install the dependencies. All of the depencies are in the generated `package.json` file. You can install them using:

```sh
npm install
```

# Configuration
You will almost certainly need to customise your `src/config.ts` file.

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

# Copyright
This project copyright 2017 Rich Buggy & [Growing eCommerce Pty Ltd](http://www.growingecommerce.com). See the LICENCE file for information about using and distributing this project.