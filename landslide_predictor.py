import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

data_frame = pd.read_csv("C:\\Users\\user\\OneDrive\\Desktop\\Studies\\Machine learning Kit\\cleaned_landslide_dataset.csv")

print(data_frame.columns)

print(data_frame["Temperature "].iloc[0])

# We have five features and 1 label
# We will be having 5 weights

X = data_frame[['Temperature ', 'Humidity ', 'Precipitation', 'Soil Moisture', 'Elevation']]
y = data_frame['Landslide Risk Prediction']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=40
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = LogisticRegression(
    solver="lbfgs", max_iter=1000
)

model.fit(X_train_scaled, y_train)

probabilities = model.predict_proba(X_test_scaled)
print(probabilities)

joblib.dump(model, "landslide_model.pkl")
joblib.dump(scaler, "scaler.pkl")

