import TDXAPI from "nqm-api-tdx/client-api";
import connectionManager from "./connection-manager";

// Loads data for a given resource id from the TDX.
// filter - an optional query filter to refine the returned data, e.g. {temperature: {$gt: 20}}
// options - options to tweak the returned data, e.g. { sort: { timestamp: -1 }, limit: 10, fields: {temperature: 1}} will sort by timestamp descending, limit the result to 10 items, and only return the temperature field in each document.
function loadResourceData({resourceId, filter, options}, onData) {
    const config = {
        commandHost: Meteor.settings.public.commandHost,
        queryHost: Meteor.settings.public.queryHost,
        accessToken: connectionManager.authToken
    };
    const tdxApi = new TDXAPI(config);

    filter = filter || "";
    options = options || "";

    console.log("loadResourceData tdxApi: ", resourceId, filter, options);

    tdxApi.getDatasetData(resourceId, filter, null, options, (err, response) => {
        if (err) console.log("Failed to get data: ", err);
        else {
            onData(null, {data: response.data});
        }
    });

    onData(null, {data: []});
}

export default loadResourceData;