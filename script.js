// Function to populate a dropdown with options
function populateDropdown(dropdownId, options, clear = true) {
    const dropdown = document.getElementById(dropdownId);
    if (clear) {
        dropdown.innerHTML = '<option value="">Select</option>'; // Clear current options first
    }

    // Populate with new options
    Object.keys(options).forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Recursive function to setup change listeners for dependent dropdowns
function setupChangeListeners(parentId, childData) {
    const parentDropdown = document.getElementById(parentId);
    if (!parentDropdown) return; // Exit if parent dropdown does not exist

    parentDropdown.addEventListener('change', function () {
        // Get the next level of data based on the parent selection
        const selectedValue = this.value;
        const nextLevelData = childData[selectedValue];

        // Determine what the next dropdown should be based on parentId
        let nextDropdownId;
        switch (parentId) {
            case 'Manufacturer': nextDropdownId = 'Model'; break;
            case 'Model': nextDropdownId = 'Prod. year'; break;
            case 'Prod. year': nextDropdownId = 'Category'; break;
            case 'Category': nextDropdownId = 'Leather interior'; break;
            case 'Leather interior': nextDropdownId = 'Fuel type'; break;
            case 'Fuel type': nextDropdownId = 'Engine volume'; break;
            case 'Engine volume': nextDropdownId = 'Cylinders'; break;
            case 'Cylinders': nextDropdownId = 'Gear box type'; break;
            case 'Gear box type': nextDropdownId = 'Drive wheels'; break;
            case 'Drive wheels': nextDropdownId = 'Wheel'; break;
            case 'Wheel': nextDropdownId = 'Color'; break;
            default: return; // No further dropdowns to update
        }

        // If there's a next level of data, populate the next dropdown and setup its listeners
        if (nextLevelData && typeof nextLevelData === 'object') {
            populateDropdown(nextDropdownId, nextLevelData, true);
            setupChangeListeners(nextDropdownId, nextLevelData); // Recursive call for next level
        }
    });
}

// Function to initialize the first level dropdown (manufacturers) and setup listeners
function initializeDropdowns(data) {
    populateDropdown('Manufacturer', data); // Changed 'manufacturer' to 'Manufacturer'
    setupChangeListeners('Manufacturer', data); // Changed 'manufacturer' to 'Manufacturer'
}

// Fetch the nested data structure and initialize dropdowns on page load
document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('dropdown_data_nested.json').then(response => response.json()),
        fetch('category_mappings.json').then(response => response.json())
    ])
        .then(([data, mappings]) => {
            initializeDropdowns(data);
            categoryMappings = mappings;
            console.log(categoryMappings)
        })
        .catch(error => console.error('Failed to load data:', error));
});


// Adjusted Function to convert form values to IDs based on mappings or leave them as is if not in mappings
function convertSelectionsToIds(selections) {
    return Object.entries(selections).reduce((acc, [key, value]) => {
        // Directly check if the key is in categoryMappings and if the specific value has a mapping
        if (categoryMappings[key] && categoryMappings[key][value] !== undefined) {
            acc[key] = categoryMappings[key][value];
        } else {
            // If no conversion is needed, keep the original value
            acc[key] = value;
        }
        return acc;
    }, {});
}


document.getElementById('car-price-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let selections = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        // Special handling for 'Leather interior'
        if (key === 'Leather interior') {
            acc[key] = value === 'Leather' ? 'Yes' : 'No';
        }
        // Convert 'Engine volume' to a float and log the value
        else if (key === 'Engine volume') {
            console.log('Engine volume before parse:', value);
            acc[key] = parseFloat(value);
            console.log('Engine volume after parse:', acc[key]);
        }
        // Convert 'Cylinders', 'Prod. year', and 'Mileage' to integers
        else if (key === 'Cylinders' || key === 'Prod. year' || key === 'Mileage') {
            acc[key] = parseInt(value, 10);
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});

    const featureOrder = [
        "Manufacturer",
        "Model",
        "Prod. year",
        "Category",
        "Leather interior",
        "Fuel type",
        "Engine volume",
        "Mileage",
        "Cylinders",
        "Gear box type",
        "Drive wheels",
        "Wheel",
        "Color"
    ];

    // Ensure categoryMappings is loaded before using it
    if (!categoryMappings) {
        console.error('Category mappings not loaded.');
        return;
    }

    const selectionsIds = convertSelectionsToIds(selections);

    console.log('Data sent in POST request:', selectionsIds);

    // let orderedSelections = {};
    // featureOrder.forEach(feature => {
    //     // Convert the feature to the expected format that matches the keys in selectionsIds
    //     const normalizedFeature = feature.charAt(0).toUpperCase() + feature.slice(1).toLowerCase().replace(/\s+/g, '');
    //     // Use the normalized feature name to index into selectionsIds
    //     if (selectionsIds.hasOwnProperty(normalizedFeature)) {
    //         orderedSelections[normalizedFeature] = selectionsIds[normalizedFeature];
    //     } else {
    //         // If a feature is listed in featureOrder but not present in selectionsIds, set it to an empty string
    //         orderedSelections[normalizedFeature] = '';
    //     }
    // });

    //console.log('Data sent in POST request:', orderedSelections);

    const requestDetails = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectionsIds)
    };

    // Log the request object
    console.log('Fetch request details:', requestDetails);


    fetch('http://127.0.0.1:8000/predict', requestDetails)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(`The predicted price for your car is: ${data.prediction}`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to get prediction.');
        });
});
