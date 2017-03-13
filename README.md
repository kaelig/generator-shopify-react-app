# Shopify React Starter Kit
This starter kit is designed to get you up and running quickly when building a new [Shopify](https://www.shopify.com/?ref=growingecommerce) embedded app using React. While it assumes you have a backend based on [Shopify Serverless Starter Kit](https://github.com/buggy/shopify-serverless-starter) you can build your own backend using any language/framework you prefer.

# Requirements

* TypeScript
* TSLint
* React
* React-Router

# Installing
Download a copy of [Shopify React Starter Kit](https://github.com/buggy/shopify-react-starter/archive/master.zip) and unzip it into your project folder. You then need to create a config file `src/config.ts` with your settings.

# Configuration
You need to create a `src/config.ts` file. There is an example files available at `src/config-example.ts`.

```typescript
export const config = {
    // Your Shopify API Key
    shopifyApiKey: "YOUR-API-KEY",

    // The base URL for our API endpoint
    baseApiUrl: "https://api.example.com/stage",

    // Set to true to enable an embedded app or false to disable it
    enableEmbedded: true
}
```

# Copyright
This project (except for Uptown CSS) is copyright 2017 Rich Buggy & [Growing eCommerce Pty Ltd](http://www.growingecommerce.com). See the LICENCE file for information about using and distributing this project.

[Uptown CSS](http://www.uptowncss.com/) is copyright 2016 [ShopPad, Inc](http://www.shoppad.com/).
