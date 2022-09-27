const http = require('http');
const fs = require('fs');
const requests = require('requests');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempval%}', orgVal.main.temp*0.1);
    temperature = temperature.replace('{%tempmin%}', orgVal.main.temp_min);
    temperature = temperature.replace('{%tempmax%}', orgVal.main.temp_max);
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%country%}', orgVal.weather[0].main);
    return temperature;
};

const homeFile = fs.readFileSync('home.html', 'utf-8');
const server = http.createServer((req, res) => {
    if(req.url == '/') {
        requests
        ('https://api.openweathermap.org/data/2.5/weather?q=bhiwandi&appid=6da19f23947fe75f92ec407399f60e39')
            .on('data', (chunk) => {
                const objsdata = JSON.parse(chunk);
                const arrData = [objsdata]
                const realTimeData = arrData
                .map((val) => replaceVal(homeFile, val))
                .join('');
                res.write(realTimeData);
            })
            .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
            // console.log('end');
        });
    }
})
server.listen(5500, "127.0.0.1");

