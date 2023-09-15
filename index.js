const fs = require("fs");
const http = require("http");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

// const server= http.createServer((req,res)=>{
//     if(req.url=="/"){
//         requests(
//             "http://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=bb1953fc4987e6edb5d3841278d0b1b3"
//             ).on("data",(chunk)=>{
//         // To convert JSON data to object
//         const objData = JSON.parse(chunk);
//         // To convert object data into an array
//         const arrayData = [objData];
//         console.log(arrayData);
//         // req.end(chunk)
//         }).on("end",(err)=>{
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
// });

const replaceVal = (tempVal, originalVal) => {
  let temperature = tempVal.replace("{%temp%}", originalVal.main.temp);
  temperature = temperature.replace("{%minTemp%}", originalVal.main.temp_min);
  temperature = temperature.replace("{%maxTemp%}", originalVal.main.temp_max);
  temperature = temperature.replace("{%country%}", originalVal.sys.country);
  temperature = temperature.replace("{%city%}", originalVal.name);
  temperature = temperature.replace("{%temptatus%}", originalVal.weather[0].name);
  return temperature;
};
//   Practice
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=bb1953fc4987e6edb5d3841278d0b1b3"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        
        // JOIN("")will convert it from string to html
        
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join(" ");

        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err)
          return console.log("There is some error that needs to resolve", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");

