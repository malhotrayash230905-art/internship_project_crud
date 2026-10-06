# Customer Management Dashboard (CRUD SPA)

A full-stack Single-Page Application (SPA) for managing customer records. Built with a modern, glassmorphism-inspired UI, a lightweight Python/Flask backend, and a MySQL database. 

## Features
- **Create**: Add new customers with name, email, phone, and status.
- **Read**: View all customers in a dynamic, responsive data table.
- **Update**: Edit existing customer information without refreshing the page.
- **Delete**: Remove customer records instantly.
- **Modern UI**: Clean design featuring glassmorphism, micro-interactions, and toast notifications.
- **No Page Reloads**: All frontend-backend communication happens asynchronously via the Fetch API.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Python 3, Flask, Flask-CORS
- **Database**: MySQL

## Prerequisites
Before running this project, ensure you have the following installed:
- [Python 3.x](https://www.python.org/downloads/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) & MySQL Workbench (or Shell)

## Setup & Installation

### 1. Database Setup
1. Open MySQL Workbench.
2. Execute the `database_setup.sql` script provided in the root directory to create the `customer_db` database and `customers` table.

### 2. Backend Setup
1. Open a terminal in the project directory.
2. Install the required Python packages:
   ```bash
   pip install Flask flask-cors mysql-connector-python
   ```
3. Update your database credentials:
   Open `app.py` and modify the `db_config` dictionary (around line 15) with your local MySQL `root` password.
   ```python
   db_config = {
       'host': 'localhost',
       'user': 'root',
       'password': 'your_actual_password_here', 
       'database': 'customer_db'
   }
   ```
4. Start the backend server:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Since the frontend is built with Vanilla JS, no build steps are required.
1. Simply double-click the `index.html` file to open it in your web browser.
2. (Optional but recommended): Use a local development server like VS Code's "Live Server" extension for a better development experience.

## Project Structure
```
├── app.py                 # Flask backend API
├── database_setup.sql     # SQL script to create DB and tables
├── index.html             # Main dashboard UI
├── script.js              # Frontend logic and API calls
├── style.css              # Custom styling (glassmorphism theme)
└── README.md              # Project documentation
```
