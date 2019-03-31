import fs from "fs";
import L from "leaflet";
import path from "path";
import React from "react";
import { render } from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";
import ResourceControl from "renderer/components/Map/ResourceDisplayer/ResourceControl";

const resourceList = [];
const resourceNameList = fs.readdirSync(__static + "/resourceLocation/fisher").map(name => name.split(".")[0]);
resourceNameList.forEach(name => {
  resourceList.push({
    locations: JSON.parse(fs.readFileSync(__static + `/resourceLocation/fisher/${name}.json`, "utf8")),
    iconUrl: path.join(__static, `/assets/fisher/${name}.png`),
    name
  });
});

class resourceContainer extends MapControl {
  constructor(props) {
    super(props);
    this.map = props.leaflet.map;
  }

  createLeafletElement() {
    const resourceContainer = L.Control.extend({
      onAdd: () => {
        this.container = L.DomUtil.create("div", "resourceControl");
        L.DomEvent.disableScrollPropagation(this.container);
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.addListener(this.container, "mousemove", L.DomEvent.stop);
        // this.container.style.width = "150px";
        render(<ResourceControl resourceList={resourceList} jobName={"fisher"} map={this.map} />, this.container);
        return this.container;
      },
      options: {
        position: "topleft"
      }
    });
    return new resourceContainer();
  }

  componentDidMount() {
    this.leafletElement.addTo(this.map);
  }
}

export default withLeaflet(resourceContainer);
