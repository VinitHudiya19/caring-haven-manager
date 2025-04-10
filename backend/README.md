
# BalSadan Backend

## Setup Instructions

1. Create a MySQL database named `balsadan`:
   ```sql
   CREATE DATABASE balsadan;
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Update the database connection string in `app.py` if needed:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/balsadan'
   ```

4. Run the Flask application:
   ```bash
   python app.py
   ```

5. Default Admin Credentials:
   - Username: `admin`
   - Password: `admin123`

   These credentials are automatically created when you first run the application.

The backend server will start on http://127.0.0.1:5000/

## API Endpoints

### Authentication
- POST `/api/login` - Admin login

### Orphans
- GET `/api/orphans` - Get all orphans
- GET `/api/orphans/<id>` - Get orphan by ID
- POST `/api/orphans` - Add a new orphan
- PUT `/api/orphans/<id>` - Update an orphan
- DELETE `/api/orphans/<id>` - Delete an orphan

### Donations
- GET `/api/donations` - Get all donations
- POST `/api/donations` - Add a new donation

### Members
- GET `/api/members` - Get all NGO members
- POST `/api/members` - Add a new member
- PUT `/api/members/<id>` - Update a member
- DELETE `/api/members/<id>` - Delete a member

### Expenses
- GET `/api/expenses` - Get all expenses
- POST `/api/expenses` - Add a new expense
- PUT `/api/expenses/<id>` - Update an expense
- DELETE `/api/expenses/<id>` - Delete an expense

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

