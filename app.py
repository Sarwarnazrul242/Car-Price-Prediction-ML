from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict
import pandas as pd
import pickle

app = Flask(__name__)

CORS(app)

# Load your trained model
with open("car_price_preditictor.pkl", "rb") as file:
    model_dict = pickle.load(file)

# Extract the model, scaler, and feature names from the dictionary
model = model_dict["model"]
scaler = model_dict["scaler"]
feature_names = model_dict["feature_names"]


@app.route("/predict", methods=["POST"])
def predict():
    # Get the JSON data sent to the POST request
    data = request.get_json(force=True)

    # Reorder the incoming JSON data according to the feature names
    ordered_data = {feature: data.get(feature) for feature in feature_names}

    # Ensure all features are present and numeric before scaling
    for feature in feature_names:
        if feature not in data or not isinstance(data[feature], (int, float)):
            return (
                jsonify({"error": f"Missing or invalid data for feature: {feature}"}),
                400,
            )

    # Convert the ordered dictionary to a DataFrame
    df_ordered_data = pd.DataFrame([ordered_data.values()], columns=feature_names)

    # Scale the data
    scaled_data = scaler.transform(df_ordered_data)

    # Predict
    prediction = model.predict(scaled_data)

    # Return the prediction as JSON
    return jsonify({"prediction": prediction.tolist()})


if __name__ == "__main__":
    app.run(debug=True, port=8000)
