📍 Logistics and Delivery Route Optimizer

A full-stack application that calculates the most efficient route for multiple delivery locations using a FastAPI backend and an interactive frontend.
🚀 Overview

This project provides a smart service to solve a classic logistics challenge: the Traveling Salesperson Problem (TSP). It's designed for scenarios like e-commerce delivery, where an agent needs to visit multiple addresses starting from a single point (e.g., a warehouse).

Instead of guessing the optimal order of visits, this service takes a list of locations and calculates the sequence that minimizes total travel distance. The backend is built with Python and FastAPI, providing a robust API, while the frontend offers a user-friendly interface to add locations and visualize the optimized route.
✨ Features

    Optimized Route Calculation: Implements the Nearest Neighbor algorithm to find an efficient delivery path.

    RESTful API: A well-structured backend built with FastAPI and Pydantic for clear data validation and contracts.

    Separation of Concerns: Cleanly separates API logic (main.py) from the core optimization algorithm (optimization.py).

    Automated Testing: Includes a suite of tests using pytest to ensure API reliability.

    Interactive Frontend: A simple web interface to add locations, send them to the API, and visualize the resulting route on an HTML canvas.

🛠️ Tech Stack

    Backend:

        Python 3.10+

        FastAPI (for the web framework)

        Uvicorn (for the ASGI server)

        Pydantic (for data validation)

        Pytest & HTTPX (for automated testing)

    Frontend:

        HTML5

        CSS3

        Vanilla JavaScript

📁 Project Structure

route-optimizer-project/
├── .gitignore
├── README.md
├── requirements.txt
│
├── .vscode/
│   └── launch.json
│
├── backend/
│   ├── __init__.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services/
│   │       └── optimization.py
│   └── tests/
│       └── test_api.py
│
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css

⚙️ Setup and Installation

To get the project running locally, follow these steps:

    Clone the repository:

    git clone https://github.com/your-username/route-optimizer-project.git
    cd route-optimizer-project

    Create and activate a Python virtual environment:

        Windows:

        python -m venv venv
        .\venv\Scripts\activate

        macOS/Linux:

        python3 -m venv venv
        source venv/bin/activate

    Install the required dependencies:

    pip install -r requirements.txt

▶️ How to Run

This is a full-stack application, so you need to run the backend and frontend separately.
1. Run the Backend Server

    From VS Code (Recommended):

        Make sure you have the official Python extension installed.

        Open the project folder in VS Code.

        Go to the "Run and Debug" panel (Ctrl+Shift+D) and press the green "Play" button (or F5).

    From the Terminal:

    uvicorn backend.app.main:app --reload

The API will be available at http://127.0.0.1:8000.
2. Run the Frontend Application

    In VS Code, make sure you have the Live Server extension installed.

    In the VS Code Explorer, navigate to the frontend folder.

    Right-click on index.html and select "Open with Live Server".

    Your default browser will open with the application running.

🧪 How to Test
Automated Tests (Backend)

To run the automated test suite for the API, run the following command from the project's root directory:

pytest

Manual API Testing (Postman)

You can also test the API endpoint manually using a tool like Postman.

    Start the backend server.

    Create a POST request to http://127.0.0.1:8000/optimize-route.

    Set the Body to raw and the type to JSON.

    Use the following payload:

    {
      "locations": [
        {"name": "Warehouse", "x": 0, "y": 0},
        {"name": "Customer A", "x": 5, "y": 5},
        {"name": "Customer B", "x": 1, "y": 8}
      ]
    }

    Send the request and inspect the response.