var path = require('path');

module.exports = (env) => {
    return {
        entry: ["./src/index.tsx"],

        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: 'dist',
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: (process.env.NODE_ENV === "production") ? "source-map" : "inline",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".tsx", ".ts", ".js"]
        },

        module: {
            rules: [
                { test: /\.(graphql|gql)$/, loader: "graphql-tag/loader", exclude: /node_modules/ },
                { test: /\.js$/, loader: "source-map-loader", enforce: "pre", exclude: /node_modules/ },
                { test: /\.tsx$/, loader: "source-map-loader", enforce: "pre", exclude: /node_modules/ },
                { test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/ }
            ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },

        devServer: {
            port: 5000,
            https: true,
            historyApiFallback: true,
            headers: { 'Access-Control-Allow-Origin': '*' }
        }
    }
};