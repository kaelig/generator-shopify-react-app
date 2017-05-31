var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('appname', { type: String, required: false });
        this.argument('shopifyapikey', { type: String, required: false });
        this.argument('graphqlapi', { type: String, required: false });
    }

    prompting() {
        const prompts = [];
        if (!this.options.appname) {
            prompts.push({
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // Default to current folder name
            });
        }
        if (!this.options.shopifyapikey) {
            prompts.push({
                type: 'input',
                name: 'shopifyapikey',
                message: 'Your Shopify API Key',
            });
        }
        if (!this.options.graphqlapi) {
            prompts.push({
                type: 'input',
                name: 'graphqlapi',
                message: 'Your GraphQL API endpoint',
            });
        }
        return this.prompt(prompts)
            .then((answers) => {
                if (answers.appname) {this.options.appname = answers.appname}
                if (answers.shopifyapikey) {this.options.shopifyapikey = answers.shopifyapikey}
                if (answers.graphqlapi) {this.options.graphqlapi = answers.graphqlapi}
            });
    }

    writing() {
        const templateFiles = [
            "index.html",
            "LICENSE",
            "package.json",
            "README.md",
            "tsconfig.json",
            "tslint.json",
            "webpack.config.js",
            "src/config.ts",
            "src/index.tsx",
            "src/components/App.tsx",
            "src/components/Callback.tsx",
            "src/components/CheckAuth.tsx",
            "src/components/Login.tsx",
            "src/containers/CallbackContainer.tsx",
            "src/containers/EmbeddedAppContainer.tsx",
            "src/containers/HomeContainer.tsx",
            "src/containers/LoginContainer.tsx",
            "src/containers/LogoutContainer.tsx",
            "src/lib/query-string.ts"
        ];
        const otherFiles = [
            "dist/.gitkeep",
            "static/css/login.css"
        ];
        const params = {
            "appname": this.options.appname || this.appname,
            "shopifyapikey": this.options.shopifyapikey || this.shopifyapikey,
            "graphqlapi": this.options.graphqlapi || this.shopifyapikey
        }

        for (const f of templateFiles) {
            this.fs.copyTpl(
                this.templatePath(f),
                this.destinationPath(f),
                params
            );
        }

        for (const f of otherFiles) {
            this.fs.copy(
                this.templatePath(f),
                this.destinationPath(f)
            );
        }

        this.fs.copy(
            this.templatePath("gitignore"),
            this.destinationPath(".gitignore")
        );
    }
};
