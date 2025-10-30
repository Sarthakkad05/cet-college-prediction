"""
Run instructions:
- Update CSV_PATH below if needed (default tries backend/data/cet_predictor_database_cleaned.csv, fallback to backend/data/colleges.csv)
- Generate encoder: python backend/services/python/generate_encoder.py
"""

from pathlib import Path
import sys

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from joblib import dump


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent.parent / "data"


def _find_csv() -> Path:
    candidates = [
        DATA_DIR / "cet_predictor_database_cleaned.csv",
        DATA_DIR / "colleges.csv",
    ]
    for p in candidates:
        if p.exists():
            return p
    raise FileNotFoundError("No CSV found in backend/data")


def main() -> int:
    try:
        csv_path = _find_csv()
    except Exception as e:
        print(str(e), file=sys.stderr)
        return 1

    df = pd.read_csv(csv_path)
    required_cols = ["Branch_Name", "Caste", "Gender"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"Missing required columns: {missing}", file=sys.stderr)
        return 1

    # Fit encoder (use sparse_output for recent scikit-learn versions)
    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
    encoder.fit(df[required_cols])

    enc_path = BASE_DIR / "encoder.joblib"
    dump(encoder, enc_path)
    print(f"Saved encoder to {enc_path}")

    # Optionally train a simple RandomForest model if none exists
    try:
        model_path = BASE_DIR / "cet_model.joblib"
        if not model_path.exists():
            # Build training matrix similar to inference
            X_cat = encoder.transform(df[required_cols])
            X_num = df[["Percentile"]].values if "Percentile" in df.columns else None
            if X_num is None:
                # If Percentile column missing, synthesize zeros (model will still be saved)
                import numpy as np
                X_num = np.zeros((X_cat.shape[0], 1))
            if hasattr(X_cat, "toarray"):
                X_cat = X_cat.toarray()
            import numpy as np
            X = np.hstack([X_num, X_cat])
            y = np.ones(X.shape[0], dtype=int)

            clf = RandomForestClassifier(n_estimators=100, random_state=42)
            clf.fit(X, y)
            dump(clf, model_path)
            print(f"Saved model to {model_path}")
    except Exception as e:
        print(f"Warning: failed to train/save model: {e}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""
Run instructions:
- (1) Ensure CSV is available (default expects backend/data/cet_predictor_database_cleaned.csv)
-     If your file is different (e.g., backend/data/colleges.csv), update CSV_PATH below.
- (2) Generate encoder: python backend/services/python/generate_encoder.py
"""

from pathlib import Path
import sys

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from joblib import dump


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent.parent / "data"

# Update this path if your dataset filename is different
CSV_PATH = DATA_DIR / "colleges.csv"
ENCODER_PATH = BASE_DIR / "encoder.joblib"


def main() -> int:
    if not CSV_PATH.exists():
        print(
            f"CSV not found at {CSV_PATH}. Update CSV_PATH to your dataset (e.g., colleges.csv)",
            file=sys.stderr,
        )
        return 1

    df = pd.read_csv(CSV_PATH)

    required_cols = ["Branch_Name", "Caste", "Gender"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"Missing required columns: {missing}", file=sys.stderr)
        return 1

    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    encoder.fit(df[required_cols])

    ENCODER_PATH.parent.mkdir(parents=True, exist_ok=True)
    dump(encoder, ENCODER_PATH)
    print(f"Saved encoder to {ENCODER_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


