import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from modules.stylometric_analysis import extract_features

data = []

base_dir = "dataset/"
labels = []

for author in os.listdir(base_dir):
    author_path = os.path.join(base_dir, author)
    if not os.path.isdir(author_path):
        continue
    for file in os.listdir(author_path):
        if file.endswith(".py") or file.endswith(".java"):
            # Determine extension
            ext = file.split(".")[-1]
            try:
                code = open(os.path.join(author_path, file), 'r', encoding='utf-8').read()
                features = extract_features(code, extension=ext)
                features["author"] = author
                data.append(features)
            except Exception as e:
                print(f"Skipping {file}: {e}")

df = pd.DataFrame(data)
X = df.drop(columns=["author"])
y = df["author"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
preds = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, preds))

# Save model
import joblib
joblib.dump(model, "stylometric_model.pkl")
print(" Model saved as stylometric_model.pkl")
