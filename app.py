from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)

CORS(app)

# Load your trained model
with open("car_price_preditictor.pkl", "rb") as model_file:
    model = pickle.load(model_file)


@app.route("/predict", methods=["POST"])
def predict():
    # Get the data from the request
    data = request.get_json(force=True)

    # Prepare the data for prediction
    # This part depends on your model's expected input format
    # For demonstration, let's assume the model expects a DataFrame
    prediction_data = pd.DataFrame([data])

    # Make prediction
    prediction = model.predict(prediction_data)
    return jsonify({"prediction": prediction[0]})  # Return the prediction


if __name__ == "__main__":
    app.run(port=5500)
