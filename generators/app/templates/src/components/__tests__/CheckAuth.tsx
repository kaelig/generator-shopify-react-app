import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";

import { CheckAuth } from "../CheckAuth";

test("Renders correctly with no shop", () => {
    const login = shallow(<CheckAuth shop={null} token={"authToken"}><h1>It's Ok</h1></CheckAuth>);

    expect(login).toMatchSnapshot();
});

test("Renders correctly with no token", () => {
    const login = shallow(<CheckAuth shop={"example.myshopify.com"} token={null}><h1>It's Ok</h1></CheckAuth>);

    expect(login).toMatchSnapshot();
});

test("Renders correctly with shop and token", () => {
    const login = <CheckAuth shop={"example.myshopify.com"} token={"authToken"}><h1>It's Ok</h1></CheckAuth>;

    const component = renderer.create(login);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
