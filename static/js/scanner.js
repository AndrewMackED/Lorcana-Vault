let model, webcam, labelContainer, maxPredictions;
let lastDetectedCard = "";

const URL = "/static/model/";

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    // Find the prediction with the highest probability
    let highestProb = 0;
    let bestMatch = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestMatch = prediction[i].className;
        }
    }

    // Trigger Flask fetch if confidence is > 95% and it's a new card
    if (highestProb > 0.98 && bestMatch !== "Blank" && bestMatch !== lastDetectedCard) {
        lastDetectedCard = bestMatch;
        fetchCardDetails(bestMatch);
    }
}

async function fetchCardDetails(detectedName) {
    try {
        const response = await fetch('/get_card_details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ className: detectedName })
        });

        const result = await response.json();

        if (result.success) {
            displayCard(result.card);
        }
    } catch (error) {
        console.error("Error fetching card details:", error);
    }
}

function displayCard(card) {
    // Basic Info
    document.getElementById("card-name").innerText = card.name;
    document.getElementById("card-ink").innerText = card.ink;
    document.getElementById("card-cost").innerText = card.cost;

    // Stats (Strength / Willpower / Lore)
    document.getElementById("card-stats").innerText = `${card.strength} / ${card.willpower}`;
    document.getElementById("card-lore").innerText = "★".repeat(card.lore); // Visual lore stars

    // Handle the Type array
    const typeContainer = document.getElementById("card-types");
    typeContainer.innerHTML = ""; // Clear old types
    card.type.forEach(t => {
        const badge = document.createElement("span");
        badge.className = "badge bg-secondary me-1";
        badge.innerText = t;
        typeContainer.appendChild(badge);
    });

    // Image
    const imgElement = document.getElementById("card-img");
    imgElement.src = card.image;
    imgElement.style.display = "block";
}