from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Database connection configuration
# Replace 'your_password' with your actual MySQL root password if needed
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '123', 
    'database': 'customer_db'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/customers', methods=['GET'])
def get_customers():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM customers ORDER BY id DESC")
        customers = cursor.fetchall()
        return jsonify(customers), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/customers', methods=['POST'])
def add_customer():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    account_status = data.get('account_status')

    if not name or not email:
        return jsonify({"error": "Name and Email are required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO customers (name, email, phone_number, account_status) VALUES (%s, %s, %s, %s)"
        values = (name, email, phone_number, account_status)
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Customer added successfully", "id": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    account_status = data.get('account_status')

    if not name or not email:
        return jsonify({"error": "Name and Email are required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "UPDATE customers SET name = %s, email = %s, phone_number = %s, account_status = %s WHERE id = %s"
        values = (name, email, phone_number, account_status, customer_id)
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Customer not found"}), 404
        return jsonify({"message": "Customer updated successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "DELETE FROM customers WHERE id = %s"
        cursor.execute(query, (customer_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Customer not found"}), 404
        return jsonify({"message": "Customer deleted successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
