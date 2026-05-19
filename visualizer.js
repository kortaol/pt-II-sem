const canv = /** @type {HTMLCanvasElement} */ (document.getElementById("visualizer"));
const ctx = canv.getContext('2d');
canv.width = canv.clientWidth; canv.height = canv.clientHeight;

const dimensionsElem = document.getElementById("dimensions");

function drawGraph(inputShape, weights) {

    const layers = weights.filter((value, index) => index % 2 === 1);
    const connections = weights.filter((value, index) => index % 2 === 0); // TODO

    const radius = 20;

    ctx.clearRect(0, 0, canv.width, canv.height)
    // Сначала связи, потом поверх нейроны с коэффициентами
    let layersNum = 1 + layers.length; // слой на вход + количество слоёв модели
    let marginH = canv.width / (layersNum + 1);
    let marginV = 15 + 2 * radius; 

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    
    // input layer
    for (let i = 0; i < inputShape; i++) {
        let neuronX = marginH;
        let neuronY = canv.height / 2 - marginV * inputShape / 2 + marginV * i;
        let layerWeights = connections[i].dataSync();
        let maxLayerWeight = Math.max(...layerWeights.map(Math.abs));
        for (let j = 0; j < layers[0].size; j++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsl(0, 0%, ${50 + layerWeights[j]/maxLayerWeight*50}%)`;
            ctx.moveTo(neuronX, neuronY);
            nextY = canv.height / 2 - marginV * layers[0].size / 2 + marginV * j;
            // console.log(layerWeights, (i * layers[0].size + j), layerWeights[i * layers[0].size + j])
            ctx.lineTo(neuronX + marginH, nextY);
            ctx.stroke();
        }
    }
    // next layers
    for (let i = 0; i < layers.length - 1; i++) {
        let layerWeights = connections[i + 1].dataSync();
        let maxLayerWeight = Math.max(...layerWeights.map(Math.abs));
        for (let j = 0; j < layers[i].size; j++) {
            let neuronX = marginH * (i + 2);
            let neuronY = canv.height / 2 - marginV * layers[i].size / 2 + marginV * j;
            for (let k = 0; k < layers[i + 1].size; k++) {
                ctx.beginPath();
                ctx.strokeStyle = `hsl(0, 0%, ${50 + layerWeights[j * layers[i + 1].size + k]/maxLayerWeight*50}%)`;
                ctx.moveTo(neuronX, neuronY);
                nextY = canv.height / 2 - marginV * layers[i + 1].size / 2 + marginV * k;
                ctx.lineTo(neuronX + marginH, nextY);
                ctx.stroke();
            }
        }
    }
    // final layer -- no strokes
    // ctx.stroke();

    ctx.strokeStyle = "black";
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
        let maxLayerWeight = Math.max(...layerWeights.map(Math.abs));
        for (let j = 0; j < layers[i].size; j++) {
            ctx.beginPath();
            let neuronX = marginH * (i + 2);
            let neuronY = canv.height / 2 - marginV * layers[i].size / 2 + marginV * j;
            ctx.fillStyle = `hsl(0, 0%, ${50 + layerWeights[j]/maxLayerWeight*50}%)`;
            // console.log(layerWeights[j]);
            ctx.arc(neuronX, neuronY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
    // final layer -- same as others


    ctx.stroke();
    ctx.closePath();
}

canv.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (isRunning) return;
    modelHiddenLayers = Math.max(modelHiddenLayers - 1, 1);
    dimensionsElem.innerText = `6 x ${modelHiddenLayers}`;
});

canv.addEventListener('click', (e) => {
    if (isRunning) return;
    switch (e.button) {
        case 0: //lmb
            modelHiddenLayers += 1
            break;

        

        default:
            break;
    }
    dimensionsElem.innerText = `6 x ${modelHiddenLayers}`;
});
