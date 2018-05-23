let cookies = parserCookieStr(document.cookie);
const qs = s => document.querySelector(s);
let $linkGetToken = qs('#linkGetToken');
let $token = qs('#token');
let $appList = qs('#apiList');
let $result = qs('#result');
let $api_str = qs('#api_str');
let $btn_exec = qs('#btn_exec');
let $cb_sync = qs('#cb_sync');
let $table_name = qs('#table_name');
let $count = qs('#count');
let $page = qs('#page');



$linkGetToken.href = `https://account.teambition.com/oauth2/authorize?client_id=81b72af0-df42-11e7-b88c-3156a53a7259&redirect_uri=${document.location.origin}/auth/callback`


$token.innerHTML = cookies.tb_token;

let apis = [
    '/version',
    '/users/me',
    '/projects',
    '/posts/me',
    '/projetcts/{projectId}/posts',
    '/tags?tagType=project&_projectId={projectId}'
]
// /tags?tagType=project&_projectId=5523e1c14c248b9727c794cb

createApiList(apis)

// when click api list
$appList.onclick = function clickApi(event) {
    event.preventDefault();
    let element = event.target;
    let api_str = element.innerHTML;
    if (element.tagName === 'A') {
        $api_str.value = api_str;
        onApiStrChange(api_str);
        // doExecute();
    }
}

$api_str.onkeyup = function (event) {
    if (event.key === "Enter") {
        doExecute();
    }
    onApiStrChange(this.value);
}

$btn_exec.onclick = function (event) {
    doExecute();
}

$cb_sync.onchange = event => {
    $table_name.disabled = !event.target.checked;
}

function onApiStrChange(v) {
    $btn_exec.disabled = v === '';
    $table_name.value = v ? v.split('?')[0].split('/')[1] : '';
}

function doExecute() {
    requestApi($api_str.value);
}

function requestApi(api) {
    // 分页 ?count=10&page=1, 默认 count=30 ，count 小于 10 无效
    let _symbol = api.indexOf('?') === -1 ? '?' : '&';
    fetch(`/api${api}${_symbol}count=${$count.value}&page=${$page.value}&sync=${$cb_sync.checked}&table=${$table_name.value}`, {
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

function copy(selector, btn) {
    let markStatus;
    $target = document.querySelector(selector);

        var range = document.createRange();
        range.selectNode($target);
        window.getSelection().addRange(range);

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy was ' + msg);
            markStatus = successful ? '√ ' : 'X ';
        } catch (err) {
            console.log('Oops, unable to copy');
            markStatus = 'X '
        }
    
    window.getSelection().removeAllRanges();
    
    if (btn && markStatus) {
        btn.innerText = markStatus + btn.innerText;
        setTimeout(() => {
            btn.innerText = btn.innerText.replace(markStatus,'')
        }, 2000);
    }


}