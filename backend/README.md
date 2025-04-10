
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

The backend server will start on http://127.0.0.1:5000/
