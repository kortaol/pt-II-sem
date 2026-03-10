const canv = /** @type {HTMLCanvasElement} */ (document.getElementById("visualizer"));
const ctx = canv.getContext('2d');
canv.width = canv.clientWidth; canv.height = canv.clientHeight;

function drawGraph(inputShape, weights) {

    const layers = weights.filter((value, index) => index % 2 === 1);
    const connections = weights.filter((value, index) => index % 2 === 0); // TODO

    const radius = 20;

    ctx.clearRect(0, 0, canv.width, canv.height)
    // Сначала связи, потом поверх нейроны с коэффициентами
    let layersNum = 1 + layers.length; // слой на вход + количество слоёв модели
    let marginH = canv.width / (layersNum + 1);
    let marginV = 15 + 2 * radius; 

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    
    // input layer
    for (let i = 0; i < inputShape; i++) {
        let neuronX = marginH;
        let neuronY = canv.height / 2 - marginV * inputShape / 2 + marginV * i;
        for (let j = 0; j < layers[0].size; j++) {
            ctx.moveTo(neuronX, neuronY);
            nextY = canv.height / 2 - marginV * layers[0].size / 2 + marginV * j;
            ctx.lineTo(neuronX + marginH, nextY);
        }
    }
    // next layers
    for (let i = 0; i < layers.length - 1; i++) {
        for (let j = 0; j < layers[i].size; j++) {
            let neuronX = marginH * (i + 2);
            let neuronY = canv.height / 2 - marginV * layers[i].size / 2 + marginV * j;
            for (let k = 0; k < layers[i + 1].size; k++) {
                ctx.moveTo(neuronX, neuronY);
                nextY = canv.height / 2 - marginV * layers[i + 1].size / 2 + marginV * k;
                ctx.lineTo(neuronX + marginH, nextY);
            }
        }
    }
    // final layer -- no strokes
    ctx.stroke();

    // input layer
    for (let i = 0; i < inputShape; i++) {
        ctx.beginPath();
        ctx.fillStyle = `#ffffff`; // all input layers are white
        let neuronX = marginH;
        let neuronY = canv.height / 2 - marginV * inputShape / 2 + marginV * i;
        ctx.arc(neuronX, neuronY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    // next layers
    for (let i = 0; i < layers.length; i++) {
        let layerWeights = layers[i].dataSync();
        for (let j = 0; j < layers[i].size; j++) {
            ctx.beginPath();
            let neuronX = marginH * (i + 2);
            let neuronY = canv.height / 2 - marginV * layers[i].size / 2 + marginV * j;
            ctx.fillStyle = `hsl(0, 0%, ${50 + layerWeights[j]*50}%)`;
            console.log(layerWeights[j]);
            ctx.arc(neuronX, neuronY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
    // final layer -- same as others


    ctx.stroke();
    ctx.closePath();
}