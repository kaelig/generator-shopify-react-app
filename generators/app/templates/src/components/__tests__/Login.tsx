import * as React from "react";
import * as renderer from "react-test-renderer";
import { Login } from "../Login";

test("Renders correctly with no error or shop", () => {
  const login = <Login
    handleStoreChanged={() => { return; }}
    handleSubmit={() => { return; }}
    errorMessage={null}
    shop={""} />;

  const component = renderer.create(login);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Renders correctly with shop", () => {
  const login = <Login
    handleStoreChanged={() => { return; }}
    handleSubmit={() => { return; }}
    errorMessage={null}
    shop={"example.myshopify.com"} />;

  const component = renderer.create(login);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Renders correctly with error", () => {
  const login = <Login
    handleStoreChanged={() => { return; }}
    handleSubmit={() => { return; }}
    errorMessage={"Store domain name is wrong"}
    shop={"example.myshopify.comx"} />;

  const component = renderer.create(login);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
