console.log(`Client side JAVASCRIPT loaded`);
const weatherForm = document.querySelector('form');
const messageOne = document.getElementById('message-1');
const messageTwo = document.getElementById('message-2');
const messageDel = document.getElementById('message-del');

const searchText = document.querySelector('input');
const delhistory = document.getElementById('delhistory');
const datagen = document.getElementById('datagen');

datagen?.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`/generatesamples`)
    .then((response) => {
        //console.log(response);
        document.location.reload();
        messageDel.textContent = response;
    }).catch((error) => {
        //console.log(error);
        messageDel.textContent = error;
    })
})
delhistory?.addEventListener('click', (e) => {
    fetch(`/deletehistory`)
    .then((response) => {
        console.log(response);
        document.location.reload();
        messageDel.textContent = response;
    }).catch((error) => {
        console.log(error);
        messageDel.textContent = error;
    })
})

weatherForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    messageOne.textContent = 'loading...';
    messageTwo.textContent = '';
    fetch(`/weather?address=${searchText.value}`)
    .then((response) => {
        response.json().then((data => {
            if(data.error) {
                console.log(data.error);
                messageOne.textContent = data.error;
                messageTwo.textContent = '';
            } else {
                messageOne.textContent = '';
                const text = `
                <p>Location: ${data.location}</p>   
                <p>Latitute: ${data.latitide} Longitude: ${data.longitude}</p>
                <p>Weather Description: ${data.forecast.weather_descriptions}</p>  
                <p>Temperature: ${data.forecast.temperature}</p>
                <p>FeelsLike: ${data.forecast.feelslike}</p>      
                <p>Precipitation: ${data.forecast.precip}</p>
                `;
                messageTwo.innerHTML = text;
            }
        }))
    })
})

// navigator.serviceWorker.register('/sw.js')
//     .then((reg) => console.log('service worker registered', reg))
//     .catch((err) => console.log('service worker not registerd', err));
