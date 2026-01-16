const logger = require('./logger');
const Stack = require('./stack');

function prec(c){
    if(c === '*' || c === '/'){
        return 2;
    }
    else if(c === '+' || c === '-'){
        return 1;
    }
    else{
        return -1;
    }
}

function ItP(exp){
    let result = '';
    let stk = new Stack();
    for(let i = 0; i < exp.length;i++){
        let c = exp[i];
        if(!isNaN(parseInt(c))){
            result += exp[i];
        }
        else if(c === '('){
            stk.push(c);
        }
        else if (c === ')') {
            while (!stk.isEmpty() && stk.peek() !== '(') {
                result += stk.pop();
            }
            stk.pop(); 
        }
        else {
            while (!stk.isEmpty() && stk.peek() !== '(' && prec(stk.peek()) >= prec(c)) {
                result += stk.pop();
            }
            stk.push(c);
        }
    }
    while(!stk.isEmpty()){
        result += stk.pop();
    }
    return result;
}

function evaluatePostfix(exp){
    let stk = new Stack();

    for(let i = 0; i < exp.length;i++){
        if(exp[i] == '+' || exp[i] == '-' || exp[i] == '*' || exp[i] == '/'){
            if (stk.size() < 2) {
                throw new Error("Invalid Postfix: Not enough operands");
            }
            let b = stk.pop();
            let a = stk.pop();
            switch(exp[i]){
                case '+':
                    stk.push(a + b);
                    break;
                case '-':
                    stk.push(a - b);
                    break;
                case '*':
                    stk.push(a * b);
                    break;
                case '/':
                    if(b === 0){
                        throw new Error("Division by zero");
                    }
                    stk.push(a / b);
                    break;
            }
        }else{
            let val = parseInt(exp[i]);
            if (!isNaN(val)) {
                stk.push(val);
            }
        }
    }
    return stk.pop();
}

function solve(expression){
    const result = evaluatePostfix(ItP(expression.expression));
    return result;
}

const requestHandler = (req, res) => {
    if (req.method === 'POST' && req.url === '/calculate') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { expression } = JSON.parse(body);
                if (!expression) {
                    throw new Error("No expression found");
                }
                logger.log(`expression: ${expression}`, "DEBUG");
                const finalResult = solve(expression);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ result: finalResult }));

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });

        return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Route not found" }));
};


module.exports = requestHandler;