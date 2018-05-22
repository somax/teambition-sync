const request = require('request');
const config = require('../config');
const log = require('solog');

/**
 * 处理 OAuth2 认证相关逻辑
 */
class Auth {
    constructor(app) {

        app.get('/auth/callback', (req, res) => {
            // 回调时传回一次性 code
            const code = req.query.code;

            // 再用 client_id、client_secret 和 code 请求 access_token
            request(
                {
                    url: config.token_uri,
                    method: 'POST',
                    body: {
                        client_id: config.client_id,
                        client_secret: config.client_secret,
                        code: code
                    },
                    json: true
                },
                (_err, _res, _body) => {
                    if (!_err) {
                        log.debug('GET_ACCESS_TOKEN:', _body.access_token);
                        app.access_token = _body.access_token;
                        // access_token 存入 cookie 以提供后续 API 请求时用
                        res.cookie('tb_token', _body.access_token)
                            .redirect('/');
                    }
                })

        });
        return app;
    }
}

module.exports = Auth;