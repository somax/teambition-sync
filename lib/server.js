
const express = require('express');
const cookieParser = require('cookie-parser');

/**
 * 启动一个 Web Server，并加上 cookie 处理中间件
 */
class Server{
    constructor(port = 3000) {
        const app = express();
        app.use(cookieParser());

        app.use(express.static(__dirname + '/../www'));
        app.listen( port , () => {
            console.log(`Server running, http://0.0.0.0:${port}`);
        });

        return app;
    }
}

module.exports = Server;