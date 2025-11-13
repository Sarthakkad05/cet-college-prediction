

# 🎓 CET College Prediction Website

A smart and user-friendly **CET (Common Entrance Test) College Predictor** built using **Cursor AI**, designed to help students estimate their admission chances based on their rank, category, gender, and preferred branch. The platform analyzes historical cut-off data and provides accurate, fast, and intuitive predictions.

---

## 🚀 Features

* **Rank-based college prediction**
  Enter CET rank and instantly get a list of possible colleges.

* **Filter by Category, Course & Region**
  Improve accuracy using filters like
  *General/OBC/SC/ST*, Engineering/Medical/Architecture, and location preferences.

* **Cut-off Data Integration**
  Predictions are based on past years’ official cut-off trends.

* **Fast & Lightweight**
  Built with optimized code and minimal dependencies.

---

## 🛠️ Tech Stack

| Component                  | Technology                                                    |
| -------------------------- | ------------------------------------------------------------- |
| **Frontend**               | React         
| **Backend**                | Node.js / Express / Python                                    |                                  
| **Database / Data Source** | JSON / CSV / API                                              |
| **Development Tool**       | **VS Code Code Editor**                                         |


---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Sarthakkad05/cet-college-prediction.git
cd cet-college-predictor
```

2. **Start frontend**

```bash
cd frontend
npm install
npm run dev
```

 for Python backend:

```bash
cd backend/services/pyhton
pip install -r requirements.txt
uvicorn predictor:app --host 127.0.0.1 --port 5000 --reload
```

3. **Start backend**

```bash
cd backend
npm run dev
```

4. Open in browser:

```
http://localhost:5173/
```

---

## 📊 How It Works

1. User enters **CET rank**, **category**, **branch**, and **region**.
2. The system checks **cut-off dataset** from previous years.
3. A prediction algorithm filters colleges based on:

   * Rank threshold
   * Course demand
   * Category reservation
   * Year-wise trends
4. Output: a sorted list of **eligible colleges + probability of getting a seat**.

---


## 💡 Future Enhancements

* NEET/JEE college predictor
* Real-time counselling updates
* User login & saved predictions
* API for developers
* Analytics dashboard

---



