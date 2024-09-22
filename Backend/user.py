import bcrypt
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
        password_hash = self.hash_password(password)
        try:
            self.cursor.execute('''
                EXEC sp_CreateUser @FirstName=?, @LastName=?, @PasswordHash=?, @Email=?
            ''', (firstname, lastname, password_hash, email))
            
            self.conn.commit()            
            return {"message": "User registered successfully!"}, 201
            
        except pyodbc.Error as e:
            if "50001" in str(e):
                return {"error": "Email already exists"}, 400
            return {"error": str(e)}, 500
        

    def update_user(self, firstname, lastname, email):
        try:
            self.cursor.execute('''
                EXEC sp_UpdateUser @FirstName=?, @LastName=?, @Email=?
            ''', (firstname, lastname, email))
            
            self.conn.commit()            
            return {"message": "User updated successfully!"}, 201
            
        except pyodbc.Error as e:
            return {"error": str(e)}, 500
                

    def update_password(self, password, email):
        password_hash = self.hash_password(password)
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
                SELECT PasswordHash, UserId, FirstName, LastName FROM Users WHERE email=?
            ''', (email,))
            result = self.cursor.fetchone()
            
            if result:
                stored_hashed_password = result[0]

                if self.verify_password(password.encode('utf-8'), stored_hashed_password):
                    # Return UserId, FirstName, and LastName upon successful login
                    return {
                        "message": "Login successful!",
                        "userid": result[1],
                        "firstname": result[2],
                        "lastname": result[3]
                    }, 200
                else:
                    return {"error": "Invalid email or password."}, 401
            else:
                return {"error": "Invalid email or password."}, 401

        except pyodbc.Error as e:
            return {"error": str(e)}, 500

    
    def get_all_users(self):
        """Fetch all users from the database"""
        try:
            self.cursor.execute('SELECT UserID, FirstName, LastName FROM Users')
            users = self.cursor.fetchall()
            return [{"id": user[0], "firstname": user[1], "lastname": user[2]} for user in users]
        
        except pyodbc.Error as e:
            raise Exception(f"Database error: {str(e)}")
        
    def hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password
    
    def verify_password(self, plain_password, hashed_password):
        if isinstance(plain_password, str):
            plain_password = plain_password.encode('utf-8')
        return bcrypt.checkpw(plain_password, hashed_password)