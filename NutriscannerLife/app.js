// Percorso alla cartella del modello
const URL = "./my_model/"; // la cartella deve chiamarsi esattamente "my_model"

let model, webcam, labelContainer, maxPredictions;

// Bottone per avviare la webcam
document.getElementById("startBtn").addEventListener("click", init);

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // Carica modello e metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Setup webcam
        const flip = true; // webcam frontale
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);

        // Prepara contenitore etichette
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // Avvia loop predizione
        window.requestAnimationFrame(loop);
    } catch (err) {
        console.error("Errore caricamento modello:", err);
        alert("Impossibile caricare il modello. Controlla la cartella my_model.");
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(1) + "%";
    }
}
