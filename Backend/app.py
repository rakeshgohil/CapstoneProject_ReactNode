from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
from file_download import FileDownload
from user import User
from file_upload import FileUpload

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# CORS(app, resources={r"/*": {"origins": "*"}})
# CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# Create an instance of the User class
user_model = User()
file_upload = FileUpload()
file_download = FileDownload()

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        password = data.get('password')
        email = data.get('email')
        
        if not firstname or not lastname or not password or not email:
            return jsonify({"error": "All fields are required"}), 400

        response, status = user_model.create_user(firstname, lastname, password, email)
        return jsonify(response), status
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/updateuser', methods=['POST'])
def update_user():
    try:
        data = request.json
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        
        if not firstname or not lastname or not email:
            return jsonify({"error": "All fields are required"}), 400

        response, status = user_model.update_user(firstname, lastname, email)
        return jsonify(response), status
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/updatepassword', methods=['POST'])
def update_password():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not password or not email:
            return jsonify({"error": "All fields are required"}), 400

        response, status = user_model.update_password(password, email)
        return jsonify(response), status
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400

        response, status = user_model.login_user(email, password)
        return jsonify(response), status
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = user_model.get_all_users()  # Assuming `get_all_users()` is implemented in the User class
        return jsonify(users), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files or 'userids' not in request.form or 'userid' not in request.form:
            return jsonify({"error": "File and users are required"}), 400
        
        file = request.files['file']
        userids = request.form['userids']
        userid = request.form['userid']  # Logged-in user ID

        if len(userids.split(',')) != 5:
            return jsonify({"error": "Exactly 5 users are required"}), 400

        # Call the function to save the file and generate the secret
        response, status = file_upload.save_file_and_generate_secret(file, userids, userid)
        return jsonify(response), status
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# Route to fetch files associated with the logged-in user
@app.route('/user-files/<int:user_id>', methods=['GET'])
def get_user_files(user_id):
    try:
        
        files = file_download.get_user_files(user_id)
        return jsonify(files), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

# Route to validate shares before allowing the download
@app.route('/validate-shares', methods=['POST'])
def validate_shares():
    data = request.json
    file_id = data.get('fileId')
    shares = data.get('shares')

    try:
        # Validate the shares and reconstruct the secret
        if file_download.validate_shares(file_id, shares):
            return jsonify({"valid": True}), 200
        else:
            return jsonify({"valid": False}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
# Route to download the file if shares are valid
@app.route('/download/<int:file_id>', methods=['GET'])
def download_file(file_id):
    try:
        file_path = file_download.download_file(file_id)
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@app.route('/getusersecret/<int:file_id>/<int:user_id>', methods=['GET'])
def get_user_secert(file_id, user_id):
    try:
        return file_download.get_file_secret_foruser(file_id, user_id)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500    
    
if __name__ == '__main__':
    app.run(debug=True)
