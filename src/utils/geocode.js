const request = require('request');

const getcode = (location, callback) => {
    const url = location 
    ? `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1Ijoid29vZHMxMjE2IiwiYSI6ImNrcjhmc3I1azJ1ZWwycnJ4Z3Q3cXk3cW4ifQ.PjsvxnoLbOpmzePuRsNaTg&limit=1` 
    : `https://api.mapbox.com/geocoding/v5/mapbox.places/%20.json?access_token=pk.eyJ1Ijoid29vZHMxMjE2IiwiYSI6ImNrcjhmc3I1azJ1ZWwycnJ4Z3Q3cXk3cW4ifQ.PjsvxnoLbOpmzePuRsNaTg&limit=1` ;

        request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback(`Unable to connect to the weather service`, undefined);
        } else if (body.features[0] === undefined) {
            callback(`unable to find center coordinates`, undefined);
        } else {
            callback(undefined, {
                latitide: body.features[0]?.center[1],
                longitude: body.features[0]?.center[0],
                location: body.features[0].place_name
            });
        }
    })
}


module.exports = getcode;