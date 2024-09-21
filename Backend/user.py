import pyodbc
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
from config import Config  # Import the configuration

class User:
    def __init__(self):
        connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()

    def create_user(self, firstname, lastname, password, email):
        # salt = os.urandom(16).hex()
        # password_hash = generate_password_hash(password)
        password_hash = hashlib.sha256(password.encode('utf-8')).digest()
        try:
            self.cursor.execute('''
                EXEC sp_CreateUser @FirstName=?, @LastName=?, @PasswordHash=?, @Email=?
            ''', (firstname, lastname, password_hash, email))
            
            self.conn.commit()            
            return {"message": "User registered successfully!"}, 201
            
        except pyodbc.Error as e:
            if "50001" in str(e):
                return {"error": "Username or Email already exists"}, 400
            return {"error": str(e)}, 500
        

    def update_user(self, firstname, lastname, email):
        try:
            self.cursor.execute('''
                EXEC sp_UpdateUser @FirstName=?, @LastName=?, @Email=?
            ''', (firstname, lastname, email))
            
            self.conn.commit()            
            return {"message": "User updated successfully!"}, 201
            
        except pyodbc.Error as e:
            if "50001" in str(e):
                return {"error": "Username already exists"}, 400
            return {"error": str(e)}, 500
                

    def update_password(self, password, email):
        password_hash = hashlib.sha256(password.encode('utf-8')).digest()
        try:
            self.cursor.execute('''
                EXEC sp_UpdatePassword @PasswordHash=?, @Email=?
            ''', (password_hash, email))
            
            self.conn.commit()            
            return {"message": "Password reset successfully!"}, 201
            
        except pyodbc.Error as e:
            return {"error": str(e)}, 500
        
    def login_user(self, email, password):
        try:
            self.cursor.execute('''
                SELECT PasswordHash, UserId FROM Users WHERE email=?
            ''', (email,))
            result = self.cursor.fetchone()
            
            if result:
                stored_password_hash = result[0]
                provided_password_hash = hashlib.sha256(password.encode('utf-8')).digest()
                
                if provided_password_hash == stored_password_hash:
                    return {"message": "Login successful!", "userid": result[1]}, 200
                else:
                    return {"error": "Invalid email1 or password."}, 401
            else:
                return {"error": "Invalid email2 or password."}, 401

        except pyodbc.Error as e:
            return {"error": str(e)}, 500
    
    def get_all_users(self):
        """Fetch all users from the database"""
        try:
            self.cursor.execute('SELECT UserID, FirstName, LastName, Username FROM Users')
            users = self.cursor.fetchall()
            return [{"id": user[0], "firstname": user[1], "lastname": user[2], "name": user[3]} for user in users]
        
        except pyodbc.Error as e:
            raise Exception(f"Database error: {str(e)}")