# CivicPulse AI Backend

This is the backend service for CivicPulse AI, an open-source multilingual civic decision intelligence layer. It provides the REST API for the frontend cockpit, handling citizen feedback analysis, priority scoring, and policy simulations.

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Validation**: Pydantic v2 & pydantic-settings
- **AI Integration**: Google GenAI SDK (`google-genai`)
- **Testing**: Pytest, pytest-asyncio, httpx
- **Linting & Formatting**: Ruff

## Getting Started

### Prerequisites
- Python 3.10 or higher (Python 3.12 recommended)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Server
Start the development server with live reload:
```bash
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. 
Interactive OpenAPI documentation is automatically generated at `http://localhost:8000/docs`.

### Testing & Quality
Run the test suite:
```bash
pytest
```
Run the Ruff linter:
```bash
ruff check .
```

## Project Structure
- `app/`: Contains the FastAPI application, routes, models, and core logic (such as `services/`, `core/`).
- `tests/`: Contains the pytest test suite for ensuring API reliability.
