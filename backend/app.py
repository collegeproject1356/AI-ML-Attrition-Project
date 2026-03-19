from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os
import json
from sklearn.tree import _tree
import numpy as np
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if not os.path.exists(os.path.join(BASE_DIR, 'prediction_model.pkl')):
    BASE_DIR = os.getcwd()

DATA_FILE = os.path.join(BASE_DIR, 'data.csv')
MODEL_FILE = os.path.join(BASE_DIR, 'prediction_model.pkl')
METADATA_FILE = os.path.join(BASE_DIR, 'model_metadata.json')

MAPPINGS = {
    'OverTime': {'No': 0, 'Yes': 1}
}

model = None
feature_cols = []
actual_accuracy = 0.85

try:
    with open(MODEL_FILE, 'rb') as f:
        artifact = pickle.load(f)
        model = artifact['model']
        feature_cols = artifact['features']
        
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r') as f:
            meta = json.load(f)
            actual_accuracy = meta.get('accuracy', actual_accuracy)
            if 'feature_names' in meta:
               feature_cols = meta['feature_names']
except Exception:
    pass

@app.route('/')
def home():
    return "🚀 Backend Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_vector = []

        for col in feature_cols:
            val = data.get(col)
            if col in MAPPINGS:
                val = MAPPINGS[col].get(val, 0)
            else:
                try:
                    val = float(val)
                except:
                    val = 0.0
            input_vector.append(val)

        prob = model.predict_proba([input_vector])[0][1] * 100
        prediction = "Yes" if prob > 50 else "No"

        return jsonify({
            "prediction": prediction,
            "probability": round(prob, 2)
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

@app.route('/api/model-info', methods=['GET'])
def model_info():
    try:
        feature_file = os.path.join(BASE_DIR, 'feature_importance.json')
        with open(feature_file, 'r') as f:
            importances = json.load(f)
        
        sorted_fi = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
        
        return jsonify({
            "accuracy": round(actual_accuracy * 100, 2),
            "feature_importance": sorted_fi
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/sample-data', methods=['GET'])
def sample_data():
    try:
        df = pd.read_csv(DATA_FILE)
        IMPORTANT_FEATURES = ['Age', 'MonthlyIncome', 'TotalWorkingYears', 'YearsAtCompany', 'DistanceFromHome', 'OverTime', 'Attrition']
        df = df[IMPORTANT_FEATURES]
        sample = df.to_dict(orient='records')
        return jsonify(sample)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/tree-data', methods=['GET'])
def tree_data():
    try:
        if model is None: 
            return jsonify({"error": "Model not loaded"}), 500
            
        tree_ = model.tree_
        feature_name = [feature_cols[i] if i != _tree.TREE_UNDEFINED else "undefined!" for i in tree_.feature]

        def recurse(node):
            if tree_.feature[node] != _tree.TREE_UNDEFINED:
                return {
                    "name": f"{feature_name[node]} <= {tree_.threshold[node]:.2f}",
                    "children": [recurse(tree_.children_left[node]), recurse(tree_.children_right[node])]
                }
            else:
                val = tree_.value[node][0]
                pred_class = "Attrition: Yes" if np.argmax(val) == 1 else "Attrition: No"
                return {"name": pred_class, "attributes": {"Samples": int(tree_.n_node_samples[node])}}

        return jsonify([recurse(0)])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)