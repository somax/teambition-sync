const Auth = require('./lib/auth');
const Server = require('./lib/server');
const request = require('request');


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
    
    request(
        {
            url: `https://api.teambition.com${req.url}`,
            headers: {
                Authorization: `OAuth2 ${req.cookies.tb_token}`
            },
            json: true
        },
        (e, r, body) => {
            res.send(body)
        }
    )
});




