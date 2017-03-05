# Shopify React Starter Kit
This starter kit is designed to get you up and running quickly when building a new [Shopify](https://www.shopify.com/?ref=growingecommerce) embedded app using React. While it assumes you have a backend based on [Shopify Serverless Kit](http://github.com/buggy/shopify-embedded-app) you can build your own backend using any language/framework you prefer.

# Requirements
Coming soon...

# Installing
Coming soon...

# Configuration
You need to create a `src/config.ts` file. There is an example files available at `src/config-example.ts`.

```typescript
export const config = {
    // The base URL for our API endpoint
    baseApiUrl: "https://zzppk2e2jc.execute-api.ap-southeast-2.amazonaws.com/dev",

    // Set to true to enable an embedded app or false to disable it
    enableEmbedded: true
}
```

# Copyright
See the LICENCE file