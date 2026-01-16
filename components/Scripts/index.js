let show = "9+(3*4)";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("answer").textContent = "";
    update();
});

function update() {
    document.getElementById("display").textContent = show;
}

function add(btn) {
    const value = btn.textContent;
    const last = show.slice(-1);

    const isNumber = !isNaN(parseInt(value));
    const isOperator = ['+', '-', '*', '/', '%'].includes(value);

    // '(' cannot be followed by operator except '-'
    if (last === '(' && isOperator && value !== '-') {
        return;
    }

    // ')' cannot be followed by a number
    if (last === ')' && isNumber) {
        return;
    }

    // number cannot be followed by '('
    if (value === '(' && !isNaN(parseInt(last))) {
        return;
    }

    show += value;
    update();
}

function clearDisplay() {
    show = "";
    document.getElementById("answer").textContent = "";
    update();
}

function backspace() {
    if (show.length === 0) return;
    show = show.slice(0, -1);
    update();
}

async function calculate() {
    try {
        const cleaned = show.replace(/\s+/g, "");

        const normalized = cleaned
            .replace(/×/g, '*')
            .replace(/x/gi, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        if (!normalized) {
            document.getElementById("answer").textContent = "Error";
            return;
        }

        const response = await fetch("http://localhost:3000/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression: normalized })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Invalid expression");
        }

        document.getElementById("answer").textContent = result.result;

    } catch (error) {
        console.error("Error:", error.message);
        document.getElementById("answer").textContent = "Error";
    }
}

