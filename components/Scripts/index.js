let show = "";

async function update(){
    document.getElementById("display").value = show;
}
function add(a){
    show += a;
    update();
}

function clearDisplay(){
    show = "";
    update();
}

function backspace(){
    show = show.slice(0, -1);
    update();
}

async function calculate(){
    try{
        const response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expression: show })
        });
        const result = await response.json();
        show = result.result;
        update();
    } catch (error) {
        console.error("Error:", error);
    }
}


