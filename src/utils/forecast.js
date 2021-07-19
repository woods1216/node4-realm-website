const request = require('request');

const forecast = (latitide, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=93944db9379d435265476f39bc2e6f79&query=${latitide},${longitude}&units=f`;

    request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback(`Unable to connect to the weather service`, undefined);
        } else if (body.error) {
            callback(`Invalid coordinates`, undefined);
        } else{
            const data = body.current;
            callback(undefined, {
                weather_descriptions: data.weather_descriptions[0],
                temperature: data.temperature,
                precip: data.precip,
                feelslike: data.feelslike,
            }) 
        }
    });    
};
module.exports = forecast;