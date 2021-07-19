console.log(`Client side JAVASCRIPT loaded`);

const weatherForm = document.querySelector('form');
const messageOne = document.getElementById('message-1');
const messageTwo = document.getElementById('message-2');

// console.log(weatherForm);
const searchText = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    messageOne.textContent = 'loading...';
    messageTwo.textContent = '';
    // console.log(`test`);
    // console.log(searchText.value);
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
