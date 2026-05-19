/**
 * @typedef {import('tf.min.js')}
 */

const log_window = document.getElementById("log");
const resElem = document.getElementById("summary");
const startButton = document.getElementById("startbutton");

let modelEpochs = 30;
let modelIterations = 100;
let modelHiddenLayers = 1;
let isRunning = false;

const training_data = tf.tensor2d([[0,0],[0,1],[1,0],[1,1]]);

document.getElementById('itersPerEpoch').addEventListener('change', (e) => {modelEpochs = parseInt(e.target.value)})
document.getElementById('epochs').addEventListener('change', (e) => {modelIterations = parseInt(e.target.value)})
document.getElementById('itersPerEpoch').addEventListener('beforeinput', (e) => {const allowedChars = /[0-9]/; if (event.data && !allowedChars.test(event.data)) event.preventDefault();});
document.getElementById('epochs').addEventListener('beforeinput', (e) => {const allowedChars = /[0-9]/; if (event.data && !allowedChars.test(event.data)) event.preventDefault();})



async function go() {

    // Очистка
    removeChildElements(log_window);
    /* Решил итоговый результат выводить рядом с кнопкой запуска, удаление не требуется
    if (resElem != null) document.body.removeChild(resElem);
    */
    startButton.disabled = true;
    isRunning = true;

    /** @type{tf.Sequential} */
    const model = tf.sequential(); // Модель с последовательными слоями
    model.add(tf.layers.dense({units: 6, activation: 'sigmoid', inputShape: [2]})); // Два нейрона на вход в слой из 6 нейронов, именно 6 условно говоря взято на рандом
    for (let i = 0; i < modelHiddenLayers - 1; i++) model.add(tf.layers.dense({units: 6, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // Один нейрон на выход из предыдущего слоя

    model.compile({
        loss: 'meanSquaredError', // Функция потерь -- СКО: насколько выдаваемые нейронкой данные далеки от искомых
        optimizer: 'adam', // adam лучше работает на разреженых градиентах (большинство значений ~=0), как в нашей задаче
    }); 

    // training_data: НН, НД, ДН, ДД -> 
    const target_data = tf.tensor2d([[0],[1],[1],[0]]); // -> НxН=Н, НxД=Д, ДxН=Д, ДxД=Н

    let str;

    for (let i = 1; i <= modelIterations ; ++i) {
        var h = await model.fit(training_data, target_data, {epochs: modelEpochs});
        str = `Отклонение от желаемого после ${i * modelEpochs} итераций (${i}-й эпохи): ${Math.trunc(h.history.loss[0] * 100) / 100}, на ${Math.trunc((h.history.loss[0] - h.history.loss[1]) * 10000000) / 10000000} лучше прошлой итерации`;
        
        let elem = document.createElement('p');
        elem.innerText = str;
        log_window.appendChild(elem);

        let slice = await model.predict(training_data).array();
        await updateResult(slice); // Возникает мелькание
        drawGraph(model.input.shape.length, model.getWeights());
    }

    startButton.disabled = false;
    isRunning = false;
}

async function updateResult(slice) {
    removeChildElements(resElem);
    for (const i of slice) {
        // Градиент из серого в белый
        let singleRes = document.createElement('p');
        let resColor = 0.5 + (i) * (1 - 0.5);
        singleRes.style.cssText = `color: hsl(0, 0%, ${resColor * 100}%);`
        singleRes.innerText = i;
        resElem.appendChild(singleRes);
    }
}


function removeChildElements(parentElement) {
  // Get all child nodes, including text and comment nodes
  const childNodes = parentElement.childNodes;

  // Iterate backwards to avoid issues with index shifting when removing nodes
  for (let i = childNodes.length - 1; i >= 0; i--) {
    const childNode = childNodes[i];
    
    // Check if the node is an Element node (nodeType === 1)
    if (childNode.nodeType === Node.ELEMENT_NODE) { // Node.ELEMENT_NODE is a constant for 1
      parentElement.removeChild(childNode);
    }
  }
}
