# Landslide Predictor

A machine learning web application designed to predict landslide risks based on environmental parameters.

## Technologies Used

### 1. Machine Learning & Data Processing
* **Python**: Core programming language used for model development and backend logic.
* **Scikit-Learn**: Used for model training (`LogisticRegression`) and feature scaling (`StandardScaler`).
* **Pandas & NumPy**: Used for dataset manipulation and data transformation.
* **Joblib**: Used for loading the saved machine learning model and scaler files (`.pkl`).

### 2. Backend Development
* **Flask**: Web framework used to construct the API endpoints.
* **Flask-CORS**: Handled Cross-Origin Resource Sharing to enable secure browser-to-server communication.

### 3. Frontend Development
* **HTML5**: Structured the web interface and inputs.
* **CSS3**: Designed responsive layouts and visual styling.
* **JavaScript (ES6+)**: Managed DOM manipulation and handled asynchronous network requests using `async/await` and the `Fetch API`.
* **Leaflet.js**: Managed the integration of map.
* **Weather API**: Managed to fetch the temperature, humidity, precipitation and soil moisture of a place
* **Elevation API**: Managed to fetch the elevation details of a place
* **Geo-encoding**: For getting the latitude and longitude of a place selected on map.

### 4. Tools & Version Control
* **Git & GitHub**: Used for source code management and team collaboration. Also used for rendering the frontend of the website.
* **Visual Studio Code**: Primary Integrated Development Environment (IDE).
* **render.com**: Use for rendering the backend of the website
