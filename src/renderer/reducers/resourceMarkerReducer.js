import imgSize from "image-size";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import { RESOURCE_MARKER } from "renderer/actions/types.js";

const initialState = {
  markers: {},
  cluster: L.markerClusterGroup({
    maxClusterRadius: 1,
    iconCreateFunction(cluster) {
      const markers = cluster.getAllChildMarkers();
      return L.divIcon({
        html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`,
        iconAnchor: [
          imgSize(`${markers[0].options.icon.options.iconUrl}`).width / 2,
          imgSize(`${markers[0].options.icon.options.iconUrl}`).height / 2
        ],
        className: "myMarker"
      });
    },
    animate: false
  })
};

export default function(state = initialState, { type, payload }) {
  // eslint-disable-next-line no-console
  console.log(payload);
  switch (type) {
    case RESOURCE_MARKER:
      return {
        ...state,
        markers: payload
      };
    default:
      return state;
  }
}
