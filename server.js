const express = require('express');
const app = express();//as express returns a function
const bodyParser = require('body-parser');
const request = require('request');//it is used to call APIS
const apiKey = 'd568dc579415266146ede4b4f9de029b';//api-key to call the open weather API

app.use(express.static('public'));
//used to access the css stylesheet which is present in the public file

app.use(bodyParser.urlencoded({ extended: true }));
//used to collect the value typed in input tag

app.set('view engine', 'ejs');
//used to specify that the format of view template will be ejs

app.get('/', (incomingRequest, serverResponse) => {
  serverResponse.render('index', {weather: null, error: null});
  //we are calling the template on visiting the particular website
});

app.get('*',function (incomingRequest, serverResponse) {
  serverResponse.send("Please enter a valid path !");
});

app.post('/', (incomingRequest, serverResponse) => {
  let city = incomingRequest.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  //we are using the request function to call the API
  request(url, function (err, response, body) {
    if(err){
      serverResponse.render('index', {weather: null, error: 'Error, please try again'});
    } 
    else {
      let weather = JSON.parse(body);//we are converting the body to a JS object
      if(! weather.main ){
        //we check if the value entered as city is available or not 
        serverResponse.render('index', {weather: null, error: 'No such city exists!'});
      } 
      else {
        let country = weather.sys.country;
        let cityName = weather.name;
        let temperature = weather.main.temp;
        let condition = weather.weather[0].description;
        serverResponse.render('index', {
          weather: {country,cityName, temperature, condition},
          error: null
        });
      }
    } 
  });
});

app.set('port', (process.env.PORT || 8000));
// We use process.env.PORT to set the port to the environment port variable if it exists. Otherwise, we’ll default to 8000, which is the port we’ll be using locally

app.listen(app.get('port'), function(){
  console.log('Server listening on port ' +app.get('port'));
});
//we are creating a server that is listening on port which we will provide