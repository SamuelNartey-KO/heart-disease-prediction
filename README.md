# Heart Disease Predictor

A web application that predicts whether heart disease is likely from a patient's details (age, sex, blood pressure, cholesterol, BMI, smoking, diabetes, physical activity, family history and stress level).

**Live site (Vercel):** https://heart-disease-prediction-bice-rho.vercel.app

**Repository:** https://github.com/SamuelNartey-KO/heart-disease-prediction

> For learning only. This is a classroom project trained on a synthetic dataset. It is not medical advice, and its accuracy is no better than chance (see the results below).

## About the project

- **Dataset:** synthetic hospital dataset supplied by the lecturer (500 patients, 10 input features, 1 target: `heart_disease`)
- **Model:** K-Nearest Neighbours (k = 5), chosen from Logistic Regression, KNN and Decision Tree using 5-fold cross-validation
- **Training:** Python and scikit-learn in Google Colab
- **Website:** hand-built with HTML, CSS and JavaScript. The model is exported as JSON and the prediction runs in the browser.
- **Hosting:** Vercel, deployed from this repository

## Test set results (100 patients)

| Metric    | Score |
|-----------|-------|
| Accuracy  | 47.0% |
| Precision | 50.0% |
| Recall    | 56.6% |
| F1 score  | 53.1% |

Precision, recall and F1 are for the "heart disease" class. Always predicting "heart disease" would score 53% accuracy on this test set, so the model does no better than guessing. The exploration graphs show why: the features barely differ between patients with and without heart disease, so the dataset gives a model almost nothing to learn from.

## Repository structure

- `data/` - the hospital dataset
- `notebooks/` - the Colab notebook (exploration, training, evaluation)
- `images/` - graphs used in the report
- `model/` - exported model (`heart_model.json`)
- `index.html`, `style.css`, `script.js` - the website

## Run it locally

Serve the folder with a local server (for example VS Code Live Server, or `python -m http.server 8000`) and open `index.html`. Opening the file directly will not work, because browsers block reading the model file.

## Author

Samuel Nartey