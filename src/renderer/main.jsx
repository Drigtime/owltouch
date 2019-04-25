import "renderer/FontAwesomeIcons.js";
import Main from "renderer/main/index.jsx";
import * as React from "react";
import { render } from "react-dom";
import "./leaflet/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./main.scss";
import { Provider } from "react-redux";
import store from "renderer/store.js";

render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("app")
);
