let cookies = parserCookieStr(document.cookie);
let $linkGetToken = document.querySelector('#linkGetToken');
let $token = document.querySelector('#token');
let $appList = document.querySelector('#apiList');
let $result = document.querySelector('#result');
let $api_str = document.querySelector('#api_str');
let $btn_exec = document.querySelector('#btn_exec');

$linkGetToken.href = `https://account.teambition.com/oauth2/authorize?client_id=81b72af0-df42-11e7-b88c-3156a53a7259&redirect_uri=${document.location.origin}/auth/callback`


$token.innerHTML = cookies.tb_token;

let apis = [
    '/version',
    '/users/me',
    '/projects',
    '/posts/me'
]

createApiList(apis)

$appList.onclick = function clickApi(event) {
    event.preventDefault();
    let element = event.target;
    let api_str = element.innerHTML;
    if (element.tagName === 'A') {
        $api_str.value = api_str;
        $btn_exec.disabled = false;
        doExecute();
    }
}

$api_str.onkeyup = function (event) {
    if (event.key === "Enter") {
        doExecute();
    }
    $btn_exec.disabled = this.value === '';
}

$btn_exec.onclick = function (event) {
    doExecute();
}

function doExecute() {
    requestApi($api_str.value);
}

function requestApi(api) {
    // 分页 ?count=10&page=1, 默认 count=30 ，count 小于 10 无效
    fetch(`/api${api}`, {
        credentials: "same-origin"
    })
        .then(
            res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw (new Error(res.statusText));
                }
            }
        )
        .then(fillResult)
        .catch(errorHandler)
}

function fillResult(content, isError) {
    if (isError) {
        $result.className = 'error'
        content = content.message;
    } else {
        $result.className = ''
    }

    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
    $result.innerText = content;
}

function createApiList(arr) {
    arr.forEach(api => {
        let _a = document.createElement('a');
        _a.href = `/api${api}`;
        _a.innerHTML = api;
        // _a.target = 'result';
        $appList.append(_a);
    })
}

function parserCookieStr(cookieStr) {
    let result = {};
    cookieStr.split('; ')
        .forEach((sec) => {
            let arrRes = sec.split('=')
            result[arrRes[0]] = arrRes[1];
        })
    return result;
}

function errorHandler(error) {
    fillResult(error, true)
    console.error(error);
}

function copy(selector) {
    $target = document.querySelector(selector);

        var range = document.createRange();
        range.selectNode($target);
        window.getSelection().addRange(range);

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    
        window.getSelection().removeAllRanges();
}