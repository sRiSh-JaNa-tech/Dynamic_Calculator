const logger = require('./logger');
const Stack = require('./stack');

function prec(c) {
    if (c === '*' || c === '/' || c === '%') return 2;
    if (c === '+' || c === '-') return 1;
    return -1;
}

function ItP(exp) {
    let result = '';
    let stk = new Stack();

    for (let i = 0; i < exp.length; i++) {
        let c = exp[i];

        if (!isNaN(parseInt(c))) {
            result += c;
        }
        else if (c === '(') {
            stk.push(c);
        }
        else if (c === ')') {
            while (!stk.isEmpty() && stk.peek() !== '(') {
                result += stk.pop();
            }
            stk.pop();
        }
        else {
            while (
                !stk.isEmpty() &&
                stk.peek() !== '(' &&
                prec(stk.peek()) >= prec(c)
            ) {
                result += stk.pop();
            }
            stk.push(c);
        }
    }

    while (!stk.isEmpty()) {
        result += stk.pop();
    }

    return result;
}

function evaluatePostfix(exp) {
    let stk = new Stack();

    for (let i = 0; i < exp.length; i++) {
        let c = exp[i];

        if (['+', '-', '*', '/', '%'].includes(c)) {
            if (stk.size() < 2) {
                throw new Error("Invalid expression");
            }

            let b = stk.pop();
            let a = stk.pop();

            switch (c) {
                case '+': stk.push(a + b); break;
                case '-': stk.push(a - b); break;
                case '*': stk.push(a * b); break;
                case '/':
                    if (b === 0) throw new Error("Division by zero");
                    stk.push(a / b);
                    break;
                case '%':
                    if (b === 0) throw new Error("Modulo by zero");
                    stk.push(a % b);
                    break;
            }
        } else {
            let val = parseInt(c);
            if (!isNaN(val)) stk.push(val);
        }
    }

    return stk.pop();
}

function solve(expression) {
    return evaluatePostfix(ItP(expression));
}

async function start_web(req, res) {
    try {
        let filePath =
            req.url === "/"
                ? path.join(__dirname, "Website", "index.html")
                : path.join(__dirname, "Website", req.url);
        const ext = path.extname(filePath);
        const mimeTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "text/javascript",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon"
        };
        const contentType = mimeTypes[ext] || "application/octet-stream";
        const data = await fs.promises.readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);

    } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
}

const requestHandler = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/calculate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { expression } = JSON.parse(body);
                if (!expression) throw new Error("No expression found");

                logger.log(`expression: ${expression}`, "DEBUG");

                const result = solve(expression);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ result }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }
    
    start_web(req, res);
};

module.exports = requestHandler;
