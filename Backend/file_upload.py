import os
import secrets
import string
import pyodbc
import hmac
import hashlib
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
from secretsharing import PlaintextToHexSecretSharer
from config import Config
from notificationservice import NotificationService


notification = NotificationService()

class FileUpload:
    def __init__(self):
        self.databases = [Config.DB1, Config.DB2, Config.DB3, Config.DB4, Config.DB5]  # List of databases
        connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()
        # Generate encryption key
        self.encryption_key = Fernet.generate_key()
        self.cipher = Fernet(self.encryption_key)
        self.hmac_key = secrets.token_hex(32)

        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)

    def save_file_and_generate_secret(self, file, userids, userid):
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)

        # Encrypt the file before saving
        with open(file_path, 'wb') as f:
            encrypted_file = self.cipher.encrypt(file.read())
            f.write(encrypted_file)

        # file.save(file_path)
        try:
            characters = string.digits
            secret = ''.join(secrets.choice(characters) for _ in range(8))
            encrypted_secret = self.cipher.encrypt(secret.encode('utf-8'))

            cleaned_userids = userids.replace("[", "").replace("]", "").replace("'", "").replace('"', "")
            connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'
            self.conn = pyodbc.connect(connection_string)
            self.cursor = self.conn.cursor()

            # Insert file info into the Files table
            self.cursor.execute('''
                EXEC sp_SaveFile @FileName=?, @FilePath=?, @UserId=?, @Secret=?, @SharedUserIDs=?, @EncryptionKey=?, @HmacKey=?
            ''', (filename, file_path, userid, encrypted_secret.decode('utf-8'), cleaned_userids, self.encryption_key.decode('utf-8'), self.hmac_key))
            self.conn.commit()
				
			# Get the FileID of the uploaded file
            file_id = self.cursor.execute('SELECT @@IDENTITY').fetchone()[0]

            self.save_file_secret(file_id, userids, secret, filename)
            return {"message": "File uploaded and shared successfully!"}, 200
			
        except pyodbc.Error as e:
            print(e)
            return {"error": str(e)}, 500

    def save_file_secret(self, fileid, userids, secret, filename):
        """Handle secret sharing, and storing information in SQL."""
        # Generate a random secret (for demo purposes, we use the filename as the secret)
        try:
            cleaned_userids = userids.replace("[", "").replace("]", "").replace("'", "").replace('"', "").split(",")

            total_shares = 5  # Total number of shares
            threshold = 3     # Minimum number of shares required to reconstruct the secret

            # Split the secret into 5 shares, requiring 3 parts to reconstruct
            shares = PlaintextToHexSecretSharer.split_secret(secret, threshold, total_shares)
            print(shares)
            # Store the secret parts in the FileSecrets table
            for i in range(5):
                notification.notify_user(Config.USEREMAILS[i], filename, shares[i])
                encrypted_share = self.cipher.encrypt(shares[i].encode('utf-8'))
                hmac_signature = hmac.new(self.hmac_key.encode(), shares[i].encode('utf-8'), hashlib.sha256).hexdigest()
                
                connection_string = f'{Config.CONNECTION_STRING};DATABASE={self.databases[i]}' 
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()

                self.cursor.execute('''
                    INSERT INTO FileSecrets (FileID, UserId, SecretPart, HmacSignature) 
                    VALUES (?, ?, ?, ?);
                ''', (fileid, cleaned_userids[i].strip(), encrypted_share.decode('utf-8'), hmac_signature))
                self.conn.commit()            
            return {"message": "File secrets are created successfully!"}, 200			
        except pyodbc.Error as e:
            print(e)
            return {"error": str(e)}, 500
