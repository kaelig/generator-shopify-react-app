import * as React from "react";
import * as renderer from "react-test-renderer";
import { Callback } from "../Callback";

test("Renders correctly with no error", () => {
  const login = <Callback errorMessage={null} />;

  const component = renderer.create(login);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Renders correctly with error", () => {
  const login = <Callback errorMessage={"Something went wrong"} />;

  const component = renderer.create(login);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
