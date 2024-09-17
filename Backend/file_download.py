import os
import pyodbc
from secretsharing import PlaintextToHexSecretSharer
from config import Config


class FileDownload:
    def __init__(self):
        self.databases = [Config.DB1, Config.DB2, Config.DB3, Config.DB4, Config.DB5]  # List of databases
        connection_string = f'DRIVER={{SQL Server}};Server=localhost\\SQLEXPRESS;DATABASE={Config.DATABASE};Trusted_Connection=True'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()

    # Fetch files associated with the given user_id
    def get_user_files(self, user_id):
        try:

            fileIds =[]
            files =[]
            file_secrets = []
            for i in range(5):
                connection_string = f'DRIVER={{SQL Server}};Server=localhost\\SQLEXPRESS;DATABASE={self.databases[i]};Trusted_Connection=True'
                
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()

                # query = '''
                #     SELECT FileID FROM FileSecrets WHERE UserID = ?
                # '''
                
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
                connection_string = f'DRIVER={{SQL Server}};Server=localhost\\SQLEXPRESS;DATABASE={Config.DATABASE};Trusted_Connection=True'
                
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()
                
                
                self.cursor.execute('SELECT UserID, FirstName, LastName, Email FROM Users')
                users = self.cursor.fetchall()
                
                query = f'''
                    SELECT FileID, FileName, FilePath, UploadedAt, SharedUserIDs FROM Files WHERE FileID IN ({placeholders})
                '''

                self.cursor.execute(query, fileIds)
                result = self.cursor.fetchall()
                
                
                for row in result:
                    
                    _, file_extension = os.path.splitext(row[1])
                    # file_extension = file_extension.replace('.', '').upper()
                    
                    # "shared": row[4],
                    shared_user_ids = [int(user_id.strip()) for user_id in row[4].split(',')]
                    

                    # Step 4: Filter the `users` list for the shared users
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
        			
        except pyodbc.Error as e:
            
            return {"error": str(e)}, 500
        
    # Validate the shares and reconstruct the secret
    def validate_shares(self, fileId, shares):
        # Fetch the file's original secret from the database
        original_secret = self.get_file_secret(fileId)

        # Reconstruct the secret from the provided shares
        try:
            reconstructed_secret = PlaintextToHexSecretSharer.recover_secret(shares)
            
            return reconstructed_secret == original_secret
        except Exception as e:
            
            return False
        
    # Fetch the file secret from the database
    def get_file_secret(self, file_id):
        query = '''
            SELECT Secret FROM Files WHERE FileID = ?
        '''
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()
        return result[0] if result else None

    # Fetch the file path based on the file_id
    def get_file_path(self, file_id):
        query = '''
            SELECT FilePath FROM Files WHERE FileID = ?
        '''
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()
        if result:
            return result[0]  # Return the file path
        else:
            raise Exception("File not found")
        