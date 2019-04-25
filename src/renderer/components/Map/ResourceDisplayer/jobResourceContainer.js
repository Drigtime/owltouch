import fs from "fs";
import L from "leaflet";
import path from "path";
import React from "react";
import { render } from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";
import ResourceControl from "renderer/components/Map/ResourceDisplayer/ResourceControl";
import { Provider } from "react-redux";
import store from "renderer/store.js";

class resourceContainer extends MapControl {
  constructor(props) {
    super(props);
    this.map = props.leaflet.map;
    this.jobId = props.jobId;
    this.jobName = props.jobName || JSON.parse(fs.readFileSync(__static + `/d2o/jobs.json`, "utf8"))[this.jobId].nameId;
    this.resourceList = [];
    this.resourcesRef = JSON.parse(fs.readFileSync(__static + `/assets/resourcesReference.json`, "utf8"))[this.jobId];
    this.resourcesRef.resources.forEach(resource => {
      this.resourceList.push({
        locations: JSON.parse(fs.readFileSync(__static + `/assets/${this.jobName}/${resource.id}.json`, "utf8")),
        iconUrl: path.join(__static, `/assets/${this.jobName}/${resource.id}.png`),
        name: resource.nameId,
        id: resource.id
      });
    });
  }

  createLeafletElement() {
    const resourceContainer = L.Control.extend({
      onAdd: () => {
        this.container = L.DomUtil.create("div", "resourceControl");
        L.DomEvent.disableScrollPropagation(this.container);
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.addListener(this.container, "mousemove", L.DomEvent.stop);
        // this.container.style.width = "150px";
        render(
          <Provider store={store}>
            <ResourceControl
              resourceList={this.resourceList}
              jobName={this.jobName}
              jobId={this.jobId}
              map={this.map}
            />
          </Provider>,
          this.container
        );
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
