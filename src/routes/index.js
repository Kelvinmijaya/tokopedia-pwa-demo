import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../components/Header"
import Search from "./Search";
import Product from "./Product";

const RouteWrapper = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route exact path="/p/:slug" component={Product} />
      <Route exact path="/" component={Search} />
    </Switch>
  </Fragment>
);

export default RouteWrapper;
