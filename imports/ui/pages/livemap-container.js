import {composeWithTracker} from "react-komposer";
import Livemap from "../components/livemap";
import loadResourceData from "../../api/manager/load-resource-data";

// Use the loadResourceData composer to populate the "data" property of the ResourceData component.
export default composeWithTracker(loadResourceData)(Livemap);