import * as http from 'http';
// let https = require("https");
import * as https from "https";

https.get("https://www.baidu.com",function(data:any) {
    console.log("hcc>>data: " , data);
})

// http.get('http://www.hccfun.com/', (res) => {
//     console.log('状态码:', res.statusCode);
//     console.log('请求头:', res.headers);

//     res.on('data', (d) => {
//         process.stdout.write(d);
//     });

// }).on('error', (e) => {
//     console.error(e);
// });