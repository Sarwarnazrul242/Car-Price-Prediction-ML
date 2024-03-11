from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the model
with open('car_price_predictor.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the POST request
    data = request.get_json(force=True)

    preprocessed_data = preprocess_data(data)

    # Make the prediction
    prediction = model.predict(preprocessed_data)

    # Return the prediction as JSON
    return jsonify({'prediction': prediction.tolist()})

def preprocess_data(data):
    return np.array(data)

if __name__ == '__main__':
    app.run(debug=True)
