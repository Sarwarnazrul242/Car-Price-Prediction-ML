import pickle
import json

# Load the trained model from a .pkl file
with open("car_price_preditictor.pkl", "rb") as file:
    model_dict = pickle.load(file)

# Check what the loaded object contains
print(f"Loaded object type: {type(model_dict)}")

# Assuming the object is a dictionary as previously indicated
if isinstance(model_dict, dict):
    # Print out the keys and the type of value associated with each key
    for key, value in model_dict.items():
        print(f"Key: {key}, Value type: {type(value)}")

    # Access the model directly
    if "model" in model_dict:
        model = model_dict["model"]
        print(f"\nLoaded Model type: {type(model)}")

        # Check for the features the model was trained with
        if "feature_names" in model_dict:
            feature_names = model_dict["feature_names"]
            print("Model was trained with the following features:", feature_names)

            # Save the feature names to a JSON file
            with open("feature_names.json", "w") as json_file:
                json.dump(feature_names, json_file, indent=4)
            print("Feature names have been saved to feature_names.json.")

        else:
            print("The 'feature_names' key is not in the model dictionary.")
    else:
        print("'model' key not found in the loaded dictionary.")

    # Check if a scaler object is present
    if "scaler" in model_dict:
        print("\nScaler object is present in the loaded dictionary.")
else:
    print("The loaded object is not a dictionary. Please check the file's content.")
