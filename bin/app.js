const http = require('http');

http.createServer((req, res) => {
    let complete = (text = 'ok', code = 200) => {
        res.writeHead(code);
        res.end(text);
    }
    if (req.method != 'POST') complete('MultiBotVK Error: POST method required', 403);

    let script;
    try {
        script = require('../scripts/' . req.url.replace('/', ''));
    }
    catch (e) {
        return complete('MultiBotVK Error: Script ' + req.url.replace('/', '') + ' not found (or other require error)', 404);
    }

    let input;
    req.on('data', chunk => input += chunk.toString());
    req.on('end', () => {
        try {
            input = JSON.parse(input);
        }
        catch (e) {
            return complete('MultiBotVK Error: Could not parse JSON input', 500);
        }

        script(input).then(result => {
            if (!result) result = { text: 'ok', code: 200 }
            complete(result.text || 'ok', result.code || 200);
        }).catch(e => {
            complete('MultiBotVK Error: Script promise rejected: ' + e.toString(), 500);
        });
    });
}).listen(80);