let model = null;

const resultBox = document.getElementById("result");
const fieldIds = [
  "age", "sex", "blood_pressure", "cholesterol", "bmi",
  "smoker", "diabetes", "physical_activity", "family_history", "stress_level",
];
const labels = {
  age: "Age",
  sex: "Sex",
  blood_pressure: "Blood pressure",
  cholesterol: "Cholesterol",
  bmi: "BMI",
  smoker: "Smoker",
  diabetes: "Diabetes",
  physical_activity: "Physical activity",
  family_history: "Family history",
  stress_level: "Stress level",
};

function showResult(html, isError = false) {
  resultBox.innerHTML = html;
  resultBox.classList.remove("hidden");
  resultBox.classList.toggle("error", isError);
}

async function loadModel() {
  try {
    const response = await fetch("model/heart_model.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    model = await response.json();
  } catch (error) {
    showResult(
      "Could not load the model file. If you opened this page by double-clicking it, " +
      "run it through a local server instead (for example VS Code Live Server).",
      true
    );
    console.error(error);
  }
}

function readInputs() {
  const values = [];
  for (const feature of model.features) {
    const raw = document.getElementById(feature).value;
    if (raw === "") {
      throw new Error("Please fill in every box.");
    }

    if (model.encoding[feature]) {
      // text choice such as Male/Female or Yes/No
      values.push(model.encoding[feature][raw]);
    } else {
      const value = parseFloat(raw);
      if (isNaN(value)) {
        throw new Error("Please fill in every box.");
      }
      const [min, max] = model.ranges[feature];
      if (value < min || value > max) {
        throw new Error(
          `${labels[feature]} should be between ${min} and ${max} (the range the model was trained on).`
        );
      }
      values.push(value);
    }
  }
  return values;
}

function predictKNN(rawValues) {
  // Scale the input exactly as the training data was scaled
  const scaled = rawValues.map(
    (v, i) => (v - model.scaler_mean[i]) / model.scaler_scale[i]
  );

  // Distance from the input to every training patient
  const distances = model.X_train.map((row, index) => {
    let sum = 0;
    for (let i = 0; i < row.length; i++) {
      sum += (row[i] - scaled[i]) ** 2;
    }
    return { distance: Math.sqrt(sum), label: model.y_train[index] };
  });

  // Take the k closest and let them vote
  distances.sort((a, b) => a.distance - b.distance);
  const neighbours = distances.slice(0, model.k);

  const votes = {};
  model.classes.forEach((c) => (votes[c] = 0));
  neighbours.forEach((n) => votes[n.label]++);

  // Highest vote wins; on a tie the first class in the list wins
  let winner = model.classes[0];
  model.classes.forEach((c) => {
    if (votes[c] > votes[winner]) winner = c;
  });

  return { winner, votes };
}

document.getElementById("predict-btn").addEventListener("click", () => {
  if (!model) {
    showResult("The model has not loaded yet. Please wait a moment and try again.", true);
    return;
  }
  try {
    const values = readInputs();
    const { winner, votes } = predictKNN(values);

    const headline = winner === 1 ? "Heart disease likely" : "Heart disease unlikely";

    showResult(
      `<strong>${headline}</strong>` +
      `<small>Votes from the ${model.k} nearest patients: ` +
      `Heart disease ${votes[1]} of ${model.k} | No heart disease ${votes[0]} of ${model.k}</small>`
    );
  } catch (error) {
    showResult(error.message, true);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  fieldIds.forEach((id) => (document.getElementById(id).value = ""));
  resultBox.classList.add("hidden");
});

loadModel();