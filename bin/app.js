const http = require('http');
const config = require('../config');

http.createServer((req, res) => {
    let url = req.url.replace('/', '').trim();
    let complete = (text = 'ok', code = 200) => {
        console.log(url, code, text);
        res.statusCode = code;
        res.end(text);
    }
    if (!url) {
        if (!config.rootRedirect) return complete('MultiBotVK Error: Empty URL', 404);
        res.setHeader('Location', config.rootRedirect);
        complete('MultiBotVK: Redirected root', 301);
    }
    if (url.startsWith('!')) {
        complete('MultiBotVK: Cleared require() cache for script ' + url.replace('!', '') + ' (if this script exists)');
        delete require.cache[url.replace('!', '')];
        return;
    }
    if (req.method != 'POST') return complete('MultiBotVK Error: POST method required, URL: ' + req.url, 403);
    if (req.url.indexOf('.') != -1) return complete('MultiBotVK Error: URL cannot contain comma: ' + req.url);
    let script;
    try {
        let path = require('path').resolve('./scripts/' + url);
        script = require(path);
    }
    catch (e) {
        return complete('MultiBotVK Error: Error requiring script ' + url + ': ' + e.message, 404);
    }

    let input = '';
    req.on('data', chunk => input += chunk.toString());
    req.on('end', () => {
        try {
            input = JSON.parse(input);
        }
        catch (e) {
            return complete('MultiBotVK Error: Could not parse JSON input: ' + input, 500);
        }

        script(input).then(result => {
            if (!result) result = { text: 'ok', code: 200 }
            complete(result.text || 'ok', result.code || 200);
        }).catch(e => {
            complete('MultiBotVK Error: Script promise rejected: ' + e.toString(), 500);
        });
    });
}).listen(config.port || 80);
