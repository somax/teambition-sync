const Auth = require('./lib/auth');
const Server = require('./lib/server');
const request = require('request');

// const log = require('./lib/log');
const log = require('solog');

// setTimeout(() => {
    
//     log.insert({ v: 'test' })
    
// }, 1000);

let app = new Server(process.argv[2]);

app = new Auth(app)

app.get('/api-list', (req, res) => {
    request(
        {
            url: 'https://docs.teambition.com/all/doc'
        },
        (e, r, body) => {
            res.send(body)
        }
    )
})

/**
 * 
 * 接口代理，当然浏览器端也可以直接调用，这里做代理是为了后续数据入库做准备 
 */
app.use('/api', (req, res) => {
    let token = req.query.access_token || req.cookies.tb_token;
    requestApi(req.url, token, (data, stateCode) => {
        res.send(stateCode, data)
    });
});

function requestApi(url, token, cb) {
    let _url = `https://api.teambition.com${url}`;
    log('request:',_url);
    request(
        {
            url: _url,
            headers: {
                Authorization: `OAuth2 ${token}`
            },
            json: true
        },
        (e, r, body) => {
            cb(body, r.statusCode)
        }
    )
}



