const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
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
        message: 'please use responsibly',
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
            })
        }
        
    })

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