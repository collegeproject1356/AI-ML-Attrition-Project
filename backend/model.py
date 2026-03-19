import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import pickle
import os
import json

def train_system():
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        DATA_FILE = os.path.join(BASE_DIR, 'data.csv')

        df = pd.read_csv(DATA_FILE)        
        IMPORTANT_FEATURES = ['Age', 'MonthlyIncome', 'TotalWorkingYears', 'YearsAtCompany', 'DistanceFromHome', 'OverTime', 'Attrition']
        
        df = df[IMPORTANT_FEATURES]

        numeric_cols = ['Age', 'MonthlyIncome', 'TotalWorkingYears', 'YearsAtCompany', 'DistanceFromHome']
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        mappings = {
            'Attrition': {'Yes': 1, 'No': 0},
            'OverTime': {'No': 0, 'Yes': 1}
        }

        for col, mapping in mappings.items():
            if col in df.columns:
                df[col] = df[col].map(mapping).fillna(0)

        X = df.drop('Attrition', axis=1)
        y = df['Attrition']
        feature_names = X.columns.tolist()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = DecisionTreeClassifier(
            criterion='entropy',
            max_depth=5,
            min_samples_leaf=5,
            class_weight='balanced',
            random_state=42
        )

        model.fit(X_train, y_train)

        accuracy_score_val = model.score(X_test, y_test)

        MODEL_FILE = os.path.join(BASE_DIR, 'prediction_model.pkl')
        with open(MODEL_FILE, 'wb') as f:
            pickle.dump({'model': model, 'features': feature_names}, f)

        METADATA_FILE = os.path.join(BASE_DIR, 'model_metadata.json')
        with open(METADATA_FILE, 'w') as f:
            json.dump({
                "accuracy": accuracy_score_val,
                "feature_names": feature_names
            }, f, indent=4)

        importances = model.feature_importances_
        feature_importance_dict = dict(zip(feature_names, importances))
        FEATURE_FILE = os.path.join(BASE_DIR, 'feature_importance.json')
        with open(FEATURE_FILE, 'w') as f:
            json.dump(feature_importance_dict, f, indent=4)

        print("Metadata & Feature importance saved!")
        print(f" Model trained! Accuracy: {accuracy_score_val*100:.2f}%")

    except Exception as e:
        print(f" Error: {e}")

if __name__ == "__main__":
    train_system()