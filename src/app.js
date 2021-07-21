const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
Realm = require('realm');
const port = process.env.PORT || 3000; 

const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//setup handlebar engine for view location
app.set('view engine', 'hbs');
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsPath);

//setup static directory to server
app.use(express.static(publicDirectoryPath));

//realm db

let SearchHistorySchema = {
    name: 'History',
    properties: {
      timestamp: 'date',
      address: 'string',
      latitide: 'string',
      longitude: 'string',
      location: 'string',
      weatherDscriptions: 'string',
      temperature: 'string',
      feelsLike: 'string',
      precipitation: 'string',
    }
  };
  
  var historyRealm = new Realm({
    path: 'search.history.realm',
    schema: [SearchHistorySchema]
  });


app.get('', (req, res) => {
    res.render('index', {
        title: 'weather',
        name: 'Abhisek Pramanik'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about me',
        name: 'Abhisek Pramanik'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        //message: 'please use responsibly',
        title: 'help',
        name: 'Abhisek Pramanik'
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'an address has to be provided'
        })
    }

    geocode(req.query.address, (error, {latitide, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        } else {
            forecast(latitide, longitude, (error, forecastData) => {
                // console.log(latitide, longitude, location);
                // console.log(forecastData);
                if (error) {
                    return res.send({
                        error: error
                    })
                }
                res.send({
                    address: req.query.address,
                    latitide: latitide,
                    longitude: longitude,
                    location: location,
                    forecast: forecastData
                });

                    historyRealm.write(() => {
                      historyRealm.create('History', 
                          { 
                              timestamp: new Date(),
                              address: req.query.address,
                              latitide: String(latitide),
                              longitude: String(longitude),
                              location: location,
                              weatherDscriptions: forecastData.weather_descriptions,
                              temperature: String(forecastData.temperature),
                              feelsLike: String(forecastData.feelslike),
                              precipitation: String(forecastData.precip),
                          });
                      });

            })
        }
        
    })

})


app.get('/generatesamples', (req, res) => {
    let timelapse = Date();
    let sampleQuantity;
    if (!req.query.num) {
        sampleQuantity = 1;
    } else {
        sampleQuantity = parseInt(req.query.num);
    }
    for (let index = 0; index < sampleQuantity; index++) {
        
        historyRealm.write(() => {
            historyRealm.create('History', 
            { 
                timestamp: new Date(),
                address: "New address",
                latitide: String(Math.random()*1000),
                longitude: String(-Math.random()*1000),
                location: "New address return",
                weatherDscriptions: "cloud",
                temperature: String(Math.abs(Math.random()*100)),
                feelsLike: String(Math.abs(Math.random()*100)),
                precipitation: String(Math.abs(Math.random()*10)),
            });
        });
    }
    timelapse -= Date();
    return res.send({
        response: `${Date()}\n Sample data Count: ${sampleQuantity} \n time taken ${parseInt(timelapse)}`,
        error: null
    })
;
})


app.get('/history', (req, res) => {
    const historyData = historyRealm.objects('History').sorted('timestamp', true);

    res.render('history', {
        title: 'history',
        data: historyData,
        name: 'Abhisek Pramanik'
    });
})

app.get('/deletehistory', (req, res) => {
    // if (!req.query.delid) {
    //     return res.send({
    //         error: 'delete id needed',
    //     })
    // }
    // if (!req.query.delid === 'ALL')  
    //     const selectDel = historyData.filtered(_id = req.query.delid);
    const historyData = historyRealm.objects('History');

    if(historyData) {
        try {
            // console.log('START All docs deleted')
            historyRealm.write(() => {
            historyRealm.delete(historyData);
            })
            //console.log('END All docs deleted')
            //const historyData = historyRealm.objects('History').sorted('timestamp', true);

            // return res.send({
            //     response: `DELETED ${Date()}`,
            //     error: null
            // })
        } catch(e) {
            return res.send({
                response: null,
                error: e
            })
        }        
    }

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })
    }
    console.log(req.query.search);

    res.send({
        products: []
    })
})



app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Abhisek Pramanik'
    })
})

app.get('/about/*', (req, res) => {
    res.render('404page', {
        title: '404',
        errorMessage: 'About Section not found',
        name: 'Abhisek Pramanik'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Abhisek Pramanik'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})