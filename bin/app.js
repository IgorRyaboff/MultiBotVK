const http = require('http');

http.createServer((req, res) => {
    let complete = (text = 'ok', code = 200) => {
        console.log(code, text);
        res.writeHead(code);
        res.end(text);
    }
    if (req.method != 'POST') return complete('MultiBotVK Error: POST method required, URL: ' + req.url, 403);
    if (!req.url.replace('/', '').trim()) return complete('MultiBotVK Error: Empty URL', 404);
    if (req.url.indexOf('.') != -1) return complete('MultiBotVK Error: URL cannot contain comma: ' + req.url);
    let script;
    try {
        let path = require('path').resolve('./scripts/' + req.url.replace('/', ''));
        script = require(path);
    }
    catch (e) {
        return complete('MultiBotVK Error: Error requiring script ' + req.url.replace('/', '') + ': ' + e.message, 404);
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
}).listen(80);
