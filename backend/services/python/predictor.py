"""
Run instructions:
- (1) Ensure encoder exists: python backend/services/python/generate_encoder.py
- (2) Start API: uvicorn backend.services.python.predictor:app --host 127.0.0.1 --port 5000 --reload
- (3) Test: curl -X POST http://127.0.0.1:5000/predict \
        -H "Content-Type: application/json" \
        -d '{"percentile": 95.2, "branch": "Computer Science", "caste": "Open", "gender": "Male", "top_n": 5}'
"""

from pathlib import Path
from typing import Literal

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from joblib import load
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "cet_model.joblib"
ENCODER_PATH = BASE_DIR / "encoder.joblib"
DATA_DIR = BASE_DIR.parent.parent / "data"


class PredictRequest(BaseModel):
    percentile: float = Field(..., ge=0.0, le=100.0)
    branch: str
    caste: str
    gender: str
    top_n: int = Field(5, ge=1, le=100)


app = FastAPI(title="CET Predictor", version="1.0.0")


def _load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    return load(MODEL_PATH)


def _load_encoder():
    if not ENCODER_PATH.exists():
        raise FileNotFoundError(
            f"Encoder not found at {ENCODER_PATH}. Run generate_encoder.py first."
        )
    return load(ENCODER_PATH)


def _load_dataframe():
    candidates = [
        DATA_DIR / "cet_predictor_database_cleaned.csv",
        DATA_DIR / "colleges.csv",
    ]
    for p in candidates:
        if p.exists():
            df = pd.read_csv(p)
            # Ensure required columns exist and normalize helper columns for robust matching
            if "Percentile" in df.columns:
                df["Percentile"] = pd.to_numeric(df["Percentile"], errors="coerce")
            for col in ["Branch_Name", "Caste", "Gender"]:
                if col in df.columns:
                    df[col + "__norm"] = (
                        df[col].astype(str).str.strip().str.lower()
                    )
            return df
    raise FileNotFoundError("Dataset not found in backend/data")


try:
    model = _load_model()
    encoder = _load_encoder()
    df_data = _load_dataframe()
except Exception as exc:
    # Defer raising until first request so the app can start and report error cleanly
    model = None
    encoder = None
    df_data = None
    _startup_error = exc
else:
    _startup_error = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest):
    if _startup_error is not None:
        raise HTTPException(status_code=500, detail=str(_startup_error))

    assert model is not None and encoder is not None and df_data is not None

    try:
        # Verify required columns
        required_cols = ["Percentile", "College_Name", "Branch_Name", "Caste", "Gender"]
        missing = [c for c in required_cols if c not in df_data.columns]
        if missing:
            raise ValueError(f"Dataset missing required columns: {missing}")

        # Normalized filter to handle case/whitespace differences
        branch_norm = str(req.branch).strip().lower()
        caste_norm = str(req.caste).strip().lower()
        gender_norm = str(req.gender).strip().lower()

        bn = "Branch_Name__norm" if "Branch_Name__norm" in df_data.columns else "Branch_Name"
        cn = "Caste__norm" if "Caste__norm" in df_data.columns else "Caste"
        gn = "Gender__norm" if "Gender__norm" in df_data.columns else "Gender"

        subset = df_data[
            (df_data[bn] == branch_norm)
            & (df_data[cn] == caste_norm)
            & (df_data[gn] == gender_norm)
        ].copy()

        # Relax filtering stepwise if empty
        if subset.empty:
            subset = df_data[df_data[bn] == branch_norm].copy()
        if subset.empty:
            subset = df_data.copy()

        # Build input rows using user's percentile + subset categories
        input_df = pd.DataFrame(
            {
                "Percentile": req.percentile,
                "Branch_Name": subset["Branch_Name"].values,
                "Caste": subset["Caste"].values,
                "Gender": subset["Gender"].values,
            }
        )

        X_cat = encoder.transform(input_df[["Branch_Name", "Caste", "Gender"]])
        X_num = input_df[["Percentile"]].values
        if hasattr(X_cat, "toarray"):
            X_cat = X_cat.toarray()
        X_processed = np.hstack([X_num, X_cat])

        preds = model.predict(X_processed)
        admitted = subset.loc[preds == 1].copy()

        # If still empty, take nearest by percentile regardless of prediction
        if admitted.empty:
            subset = subset.copy()
            subset["PercentileDiffAbs"] = (subset["Percentile"].astype(float) - req.percentile).abs()
            nearest = subset.sort_values("PercentileDiffAbs").head(req.top_n)
            return {"colleges": nearest["College_Name"].tolist()}

        # Compute non-negative percentile difference and sort ascending
        admitted["PercentileDiff"] = req.percentile - admitted["Percentile"].astype(float)
        admitted = admitted[admitted["PercentileDiff"] >= 0]
        if admitted.empty:
            # If user's percentile is lower than all, fall back to nearest above
            subset = subset.copy()
            subset["PercentileDiffAbs"] = (subset["Percentile"].astype(float) - req.percentile).abs()
            nearest = subset.sort_values("PercentileDiffAbs").head(req.top_n)
            return {"colleges": nearest["College_Name"].tolist()}

        admitted = admitted.sort_values("PercentileDiff")
        colleges = admitted["College_Name"].tolist()[: req.top_n]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return {"colleges": colleges}


