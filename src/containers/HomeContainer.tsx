import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, DisplayText, FooterHelp, Page, Subheading } from "@shopify/polaris";
import { EmbeddedApp, Alert } from "@shopify/polaris/embedded";

import { config } from "../config";

declare namespace ShopifyApp {
  function init(params: any): any;
}

class HomeContainerState {
  showModal: boolean;
}

export class HomeContainer extends React.Component<RouteComponentProps<undefined>, HomeContainerState> {
  constructor(props: RouteComponentProps<undefined>) {
    super(props);
    this.state = {
      showModal: false
    };
    this.handleSave = this.handleSave.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  hideModal(): void {
    this.setState({
      showModal: false
    });
  }

  handleSave(): void {
    this.setState({
      showModal: true
    });
  }

  render(): JSX.Element {
    const shop = sessionStorage.getItem("shop");

    ShopifyApp.init({
      apiKey: config.shopifyApiKey,
      shopOrigin: `https://${shop}`
    });

    return (
      <EmbeddedApp apiKey={config.shopifyApiKey} shopOrigin={`https://${shop}`}>
        <Page title="Example application" primaryAction={{ content: "Save", onAction: this.handleSave }} secondaryActions={[{ content: "Dashboard", url: "/" }]}>

          <Card sectioned>
            <DisplayText size="small">This starter kit makes it easy to get started building embedded Shopify apps using React.</DisplayText>
          </Card>

          <Card sectioned>
            <Subheading>The Tech Stack</Subheading>
            <ul>
              <li><a href="https://facebook.github.io/react/" target="_blank">React</a></li>
              <li><a href="http://www.uptowncss.com/" target="_blank">TypeScript</a></li>
              <li><a href="https://palantir.github.io/tslint/" target="_blank">TSLint</a></li>
              <li><a href="https://polaris.shopify.com/" target="_blank">Polaris</a></li>
            </ul>
            <p>For more information please see the <a href="https://github.com/buggy/shopify-react-starter">README</a>.</p>
          </Card>

          <Alert open={this.state.showModal} onConfirm={this.hideModal} confirmContent="Ok" >Saved!!</Alert>

          <FooterHelp>
            Shopify Serverless Starter Kit &mdash; &copy; 2017 <a href="http://www.growingecommerce.com/" target="_blank">Growing eCommerce Pty Ltd</a>.
          </FooterHelp>
        </Page>
      </EmbeddedApp>
    );
  }
}