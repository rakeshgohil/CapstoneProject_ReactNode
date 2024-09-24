import hashlib
import hmac
import os
import pyodbc
from secretsharing import PlaintextToHexSecretSharer
from config import Config
from cryptography.fernet import Fernet


class FileDownload:
    def __init__(self):
        self.databases = [Config.DB1, Config.DB2, Config.DB3, Config.DB4, Config.DB5]  # List of databases
        connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()

    # Fetch files associated with the given user_id
    def get_user_files(self, user_id):
        try:
            fileIds =[]
            files =[]
            file_secrets = []
            for i in range(5):
                connection_string = f'{Config.CONNECTION_STRING};DATABASE={self.databases[i]}'
        
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()

                query = '''
                    SELECT FileID, SecretPart FROM FileSecrets WHERE UserID = ?
                '''
                self.cursor.execute(query, user_id)
                result = self.cursor.fetchall()
                
                # Append the results to the files list
                for row in result:
                    fileIds.append(row[0])
                    file_secrets.append({"fileId": row[0], "secretPart": row[1]})
                    
            if fileIds:
                placeholders = ','.join(['?'] * len(fileIds))
                connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()                
                
                self.cursor.execute('SELECT UserID, FirstName, LastName, Email FROM Users')
                users = self.cursor.fetchall()
                
                query = f'''
                    SELECT FileID, FileName, FilePath, UploadedAt, SharedUserIDs, EncryptionKey, HmacKey 
                    FROM Files WHERE FileID IN ({placeholders})
                '''

                self.cursor.execute(query, fileIds)
                result = self.cursor.fetchall()
                                
                for row in result:                    
                    _, file_extension = os.path.splitext(row[1])
                    shared_user_ids = [int(user_id.strip()) for user_id in row[4].split(',')]

                    shared_users = [
                        {
                            "id": user[0],  # UserID
                            "name": f"{user[1]} {user[2]}",  # FirstName LastName
                            "email": user[3],  # Email
                            "avatarUrl": f"/assets/images/mock/avatar/avatar-1.webp",  # You can adjust this based on your logic
                            "permission": "edit"  # Assuming the permission is always "edit"
                        }
                        for user in users if user[0] in shared_user_ids
                    ]
                    secret_part = next((file["secretPart"] for file in file_secrets if file["fileId"] == row[0]), None)
                    files.append({"isFavorited": False, "id": row[0], "secretpart":secret_part, "name": row[1], "type":file_extension, "url": row[2], "createdAt": row[3], "modifiedAt": row[3], "size":0, "shared": shared_users, "tags": ["Technology", "Health and Wellness", "Travel", "Finance", "Education"],})

            return files        
        			
        except Exception as e:
            print(e)
            return {"error": str(e)}, 500
    # Validate the shares and reconstruct the secret
    def validate_shares(self, fileId, shares):
        try:
            _, encryption_key, hmac_key = self.get_file_info(fileId)
            query = '''
                SELECT SecretPart, HmacSignature FROM FileSecrets WHERE FileID = ?
            '''
            isValidShare = False
            for share in shares:                
                isValidShare = False
                for i in range(5):                    
                    connection_string = f'{Config.CONNECTION_STRING};DATABASE={self.databases[i]}'
                    self.conn = pyodbc.connect(connection_string)
                    self.cursor = self.conn.cursor()
                    self.cursor.execute(query, fileId)
                    result = self.cursor.fetchone()
                    
                    if result:
                        valid_hmac = hmac.new(hmac_key.encode(), share.encode('utf-8'), hashlib.sha256).hexdigest()
                        if hmac.compare_digest(result[1], valid_hmac):
                            isValidShare = True
                            break

                if isValidShare == False:
                    raise ValueError("Share validation failed! Secret mismatch.!")
                                                 
            original_secret = self.get_file_secret(fileId, encryption_key)
            reconstructed_secret = PlaintextToHexSecretSharer.recover_secret([share for share in shares])
            original_secret_str = str(original_secret).zfill(8)
            reconstructed_secret_str = str(reconstructed_secret).zfill(8) 
            
            return original_secret_str == reconstructed_secret_str
        
        except Exception as e:            
            print(e)
            return False
        
    # Fetch the file secret from the database
    def get_file_secret(self, file_id, encryption_key):
        query = '''
            SELECT Secret FROM Files WHERE FileID = ?
        '''
        connection_string = f'{Config.CONNECTION_STRING};DATABASE={Config.DATABASE}'            
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()

        if result:
            encrypted_secret = result[0]
            cipher = Fernet(encryption_key)
            file_secret = cipher.decrypt(encrypted_secret.encode('utf-8')).decode('utf-8')   
            return str(file_secret)        
        return None

    # Fetch the file path based on the file_id
    def get_file_info(self, file_id):
        query = '''
            SELECT FilePath, EncryptionKey, HmacKey FROM Files WHERE FileID = ?
        '''
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()
        if result:
            return result[0], result[1], result[2] 
        else:
            raise Exception("File not found")
        
    
    def get_file_secret_foruser(self, file_id, user_id):
        _, encryption_key, _ = self.get_file_info(file_id)

        query = '''
            SELECT SecretPart FROM FileSecrets WHERE FileID = ? AND UserID = ?
        '''
    
        for i in range(5):
            connection_string = f'{Config.CONNECTION_STRING};DATABASE={self.databases[i]}'
    
            self.conn = pyodbc.connect(connection_string)
            self.cursor = self.conn.cursor()

            self.cursor.execute(query, file_id, user_id)
            result = self.cursor.fetchone()

            if result:
                fernet = Fernet(encryption_key)
                decrypted_data = fernet.decrypt(result[0])
                return decrypted_data

    def decrypt_file(self, file_path, encryption_key):
        """Decrypt the file using Fernet symmetric encryption."""
        try:
            with open(file_path, 'rb') as encrypted_file:
                encrypted_data = encrypted_file.read()

            fernet = Fernet(encryption_key)
            decrypted_data = fernet.decrypt(encrypted_data)

            # Save the decrypted file
            base_name = os.path.splitext(file_path)[0]  # Remove only the last extension    
            decrypted_file_path = base_name + "_decrypted" + os.path.splitext(file_path)[1]

            with open(decrypted_file_path, 'wb') as decrypted_file:
                decrypted_file.write(decrypted_data)

            return decrypted_file_path

        except Exception as e:
            print(e)
            raise Exception("File decryption failed")            

    def download_file(self, file_id):
        try:

            file_path, encryption_key, _ = self.get_file_info(file_id)

            # if not self.validate_shares(file_id, shares, hmac_key):
            #     raise Exception("Invalid shares or HMAC validation failed")
            
            decrypted_file_path = self.decrypt_file(file_path, encryption_key)

            # with open(decrypted_file_path, 'rb') as decrypted_file:
            #     return decrypted_file.read()
            return decrypted_file_path
        
        except Exception as e:
            raise Exception("Error decrypting the file")