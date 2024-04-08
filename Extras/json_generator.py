import pandas as pd
import json

# Load the CSV file
df = pd.read_csv("car_price_prediction.csv")

# Normalize the data according to specified rules
df["Leather interior"] = df["Leather interior"].apply(
    lambda x: "Leather" if x == "Yes" else "Cloth"
)

# Initialize the main dictionary
data_hierarchy = {}


# Function to build nested structure, now also applying transformations to values
def build_nested_structure(sub_df, attributes):
    if not attributes:
        return []
    attribute = attributes[0]
    next_level = {}
    for value in sub_df[attribute].dropna().unique():
        # Transform values based on attribute specific rules
        str_value = str(value)
        filtered_df = sub_df[sub_df[attribute] == value]
        next_level[str_value] = build_nested_structure(filtered_df, attributes[1:])
    return next_level if next_level else []


# Attributes in order of selection
attribute_order = [
    "Manufacturer",
    "Model",
    "Prod. year",
    "Category",
    "Leather interior",
    "Fuel type",
    "Engine volume",
    "Cylinders",
    "Gear box type",
    "Drive wheels",
    "Wheel",
    "Color",
]

# Construct the data hierarchy
for manufacturer in df["Manufacturer"].dropna().unique():
    manufacturer_df = df[df["Manufacturer"] == manufacturer]
    models = {}
    for model in manufacturer_df["Model"].dropna().unique():
        model_df = manufacturer_df[manufacturer_df["Model"] == model]
        # Building the nested structure for each model
        models[model] = build_nested_structure(
            model_df, attribute_order[2:]
        )  # Exclude manufacturer and model
    data_hierarchy[manufacturer] = models

# Save to JSON file
with open("dropdown_data_nested.json", "w") as json_file:
    json.dump(data_hierarchy, json_file, indent=4)
