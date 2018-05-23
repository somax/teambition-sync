let cookies = parserCookieStr(document.cookie);
const qs = s => document.querySelector(s);
let $linkGetToken = qs('#linkGetToken');
let $token = qs('#token');
let $appList = qs('#apiList');
let $result = qs('#result');
let $apiStr = qs('#api_str');
let $btnExec = qs('#btn_exec');
let $cboxSync = qs('#cb_sync');
let $tableName = qs('#table_name');
let $count = qs('#count');
let $page = qs('#page');

let apis = [
    { table: 'version', uri: '/version' },
    { table: 'users', uri: '/users/me' },
    { table: 'projects', uri: '/projects' },
    { table: 'posts', uri: '/posts/me' },
    { table: 'posts', uri: '/projetcts/{projectId}/posts' },
    { table: 'tags', uri: '/tags?tagType=project&_projectId={projectId}' }
]

$linkGetToken.href = `https://account.teambition.com/oauth2/authorize?client_id=81b72af0-df42-11e7-b88c-3156a53a7259&redirect_uri=${document.location.origin}/auth/callback`

$token.innerHTML = cookies.tb_token;

createApiList(apis)

$appList.onclick = onClickApi;
$apiStr.onkeyup = onApiStrKeyup;
// $apiStr.oninput = onApiStrChange;
$btnExec.onclick = doExecute;
$cboxSync.onchange = toggleTableNameDisabled;

// 点击 API 列表项目时将该项目填充到 API 输入框
function onClickApi(event) {
    event.preventDefault();
    let element = event.target;
    let apiStr = element.innerText;
    if (element.tagName === 'A') {
        $apiStr.value = apiStr;
        $tableName.value = element['data-table'];
        toggleExecBtnDisabled(apiStr);
        // doExecute();
    }
}

// 
function onApiStrKeyup(event) {
    if (event.key === "Enter") {
        doExecute();
    }
    toggleExecBtnDisabled(this.value);
}

// function onApiStrChange(event) {
//     toggleExecBtnDisabled(event.target.value);
// }
// 
function toggleTableNameDisabled(event) {
    $tableName.disabled = !event.target.checked;
}

// 一些API输入框变化后的自动操作
function toggleExecBtnDisabled(v) {
    $btnExec.disabled = v === '';
}

function setTableName() {
    // 根据 API 名称自动预测数据库表名
    // $table_name.value = v ? v.split('?')[0].split('/')[1] : '';
}

function doExecute() {
    requestApi($apiStr.value);
}

function requestApi(api) {
    // 分页 ?count=10&page=1, 默认 count=30 ，count 小于 10 无效
    let _symbol = api.indexOf('?') === -1 ? '?' : '&';
    let isError = false;
    fetch(`/api${api}${_symbol}count=${$count.value}&page=${$page.value}&sync=${$cboxSync.checked}&table=${$tableName.value}`, {
        credentials: "same-origin"
    })
        .then(
            res => {
                if (res.ok) {
                    return res.json();
                } else {
                    isError = true;
                    return res.text();
                }
            }
        )
        .then(data => fillResult(data, isError))
        .catch(errorHandler)
}

function fillResult(content, isError) {
    $result.className = isError ? 'error' : '';

    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
    $result.innerText = content;
}

function createApiList(apis) {
    apis.forEach(api => {
        let _a = document.createElement('a');
        _a.href = `/api${api.uri}`;
        _a.innerHTML = api.uri;
        _a['data-table'] = api.table;

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
    // fillResult(error, true)
    console.error(error);
}

// 
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
            btn.innerText = btn.innerText.replace(markStatus, '')
        }, 2000);
    }


}