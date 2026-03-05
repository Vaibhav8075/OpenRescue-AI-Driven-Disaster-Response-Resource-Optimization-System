import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

texts = [
    "Minor water logging in street",
    "Small fire in garbage area",
    "Road blocked due to fallen tree",
    "Flood water entering houses",
    "People trapped in building",
    "Severe earthquake damage",
    "Bridge collapse reported",
    "Massive landslide blocking highway",
    "Cyclone destroyed houses",
    "Water rising rapidly, people stranded"
]

labels = [
    "Low",
    "Low",
    "Medium",
    "High",
    "High",
    "Critical",
    "Critical",
    "High",
    "Critical",
    "Critical"
]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("severity_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved successfully.")
