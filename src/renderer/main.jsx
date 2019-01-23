import "renderer/FontAwesomeIcons.js";
import Main from "renderer/main/index.jsx";
import * as React from "react";
import { render } from "react-dom";
import "./leaflet/leaflet.css";
import "./main.scss";

render(<Main />, document.getElementById("app"));
