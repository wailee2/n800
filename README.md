# N800 — Portfolio Manager

A  portfolio dashboard for tracking **Fiat**, **Assets**, and **Gold** holdings. Built with a Next.js frontend, FastAPI backend, SQLite database, and AI-powered advice via Ollama.

---

## What It Does

- Track holdings across three categories: Fiat (currencies), Assets (stocks/ETFs), and Gold
- Fetch live market prices from free public APIs — no paid subscriptions needed
- Calculate portfolio value, profit/loss, ROI, and annualized return automatically
- Visualize allocation, performance, and category breakdown with charts
- Generate 3 AI advice cards tailored to your actual portfolio data using a local LLM

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 15, React, Tailwind CSS v4  |
| Charts     | Recharts                            |
| Data Fetching | TanStack Query (React Query)     |
| Backend    | Python, FastAPI                     |
| Database   | SQLite (via SQLAlchemy / SQLModel)  |
| AI Advice  | Ollama (local LLM — llama3)         |
| Market Data | Frankfurter, Stooq, CoinGecko     |

---

## Project Structure

```
n800/
├── frontend/                   # Next.js app
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── holdings/       # Holdings management
│   │   │   └── analytics/      # ROI + performance breakdown
│   │   ├── components/         # UI components
│   │   │   ├── dashboard/      # Summary cards, charts
│   │   │   ├── holdings/       # Table, form, row
│   │   │   ├── ai/             # Advice panel + cards
│   │   │   └── ui/             # Shared: Button, Modal, Badge, Spinner
│   │   ├── hooks/              # TanStack Query hooks
│   │   ├── lib/                # API wrappers, formatters
│   │   └── types/              # Shared TypeScript types
│   └── package.json
│
├── backend/                    # FastAPI app
│   ├── app/
│   │   ├── main.py             # App entry, CORS, routers
│   │   ├── database.py         # SQLAlchemy engine + session
│   │   ├── models.py           # ORM model: Holding
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── portfolio.py    # CRUD + summary endpoints
│   │   │   ├── market.py       # Live price + FX endpoints
│   │   │   └── ai.py           # AI advice endpoint
│   │   └── services/
│   │       ├── market_service.py       # Frankfurter, Stooq, CoinGecko calls
│   │       ├── calculation_service.py  # ROI, annual return, allocation
│   │       └── ai_service.py           # Ollama prompt + response
│   ├── .env
│   ├── requirements.txt
│   └── n800.db                 # Auto-created SQLite database
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed before you begin:

- **Node.js** v18 or later
- **Python** 3.10 or later
- **pip** and **venv**
- **Ollama** — download from [ollama.com](https://ollama.com) and install it

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wailee2/n800.git
cd n800
```

### 2. Set up the backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate       # linux/mac: source venv/bin/activate 

# Install dependencies
pip install -r requirements.txt 


# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `backend/.env`:

```env
FRANKFURTER_BASE_URL=https://api.frankfurter.app
COINGECKO_API_KEY=your_free_demo_key_here
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
STOOQ_BASE_URL=https://stooq.com
OLLAMA_BASE_URL=http://localhost:11434
DATABASE_URL=sqlite:///./n800.db
```

> Get a free CoinGecko Demo API key at [coingecko.com/api](https://www.coingecko.com/en/api). Frankfurter and Stooq require no key.

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs are available at `http://localhost:8000/docs`.

### 3. Set up the frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy the example env file
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

The app will be live at `http://localhost:3000`.

### 4. Set up Ollama (AI Advice)

```bash
# Pull the llama3 model (one-time, ~4GB download)
ollama pull llama3

# Ollama runs automatically as a background service
# It listens on http://localhost:11434 by default
```

The AI advice panel will work once Ollama is running and the model is pulled. If Ollama is not running, the advice panel will show a fallback message and the rest of the app continues to work normally.

---

## API Overview

| Method | Endpoint                        | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | `/portfolio/summary`            | Total value, ROI, profit/loss    |
| GET    | `/portfolio/holdings`           | All holdings                     |
| POST   | `/portfolio/holdings`           | Add a new holding                |
| PUT    | `/portfolio/holdings/{id}`      | Update a holding                 |
| DELETE | `/portfolio/holdings/{id}`      | Delete a holding                 |
| GET    | `/market/price/{symbol}`        | Current price for a symbol       |
| GET    | `/market/fx/{pair}`             | FX rate for a currency pair      |
| GET    | `/ai/advice`                    | Generate 3 AI advice cards       |

Full interactive documentation is available at `http://localhost:8000/docs` when the backend is running.

---

## Calculation Reference

**ROI**
```
ROI = ((Current Value - Invested Amount) / Invested Amount) × 100
```

**Yearly Return**
```
Yearly Return = Current Value - Invested Amount
```

**Annualized Return**
```
Annualized Return = ((Current Value / Invested Amount) ^ (1 / Years Held)) - 1
```

**Category Allocation**
```
Allocation % = (Category Value / Total Portfolio Value) × 100
```

---

## Market Data Sources

| Data            | Provider         | API Key Required |
|-----------------|------------------|------------------|
| Fiat / FX rates | Frankfurter      | No               |
| Stocks / ETFs   | Stooq            | No               |
| Gold (XAUUSD)   | Stooq            | No               |
| Crypto assets   | CoinGecko Demo   | Yes (free tier)  |

---

## Holding Fields

Each holding stores the following:

| Field          | Type     | Description                        |
|----------------|----------|------------------------------------|
| `id`           | int      | Auto-generated primary key         |
| `name`         | string   | Display name (e.g. Apple Inc.)     |
| `category`     | enum     | `fiat` / `asset` / `gold`          |
| `symbol`       | string   | Ticker or currency code            |
| `quantity`     | float    | Amount held                        |
| `buy_price`    | float    | Price at time of purchase          |
| `current_price`| float    | Latest fetched market price        |
| `buy_date`     | date     | Date of purchase                   |
| `notes`        | string   | Optional personal notes            |

---

## Running Both Servers

Open two terminal windows and run:

**Terminal 1 — Backend**
```bash
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend**
```bash
cd frontend && npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Scope and Limitations

This is an assignment project. It intentionally does not include:

- User authentication or accounts
- Multi-user support
- Cloud database or remote storage
- Push notifications
- Payment or billing features
- Admin panel

Everything runs locally on your machine.

---

## License

MIT — free to use and modify for educational purposes.