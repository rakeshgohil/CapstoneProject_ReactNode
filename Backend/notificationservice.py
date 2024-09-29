import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import Config

class NotificationService:
    def __init__(self):        
        self.smtp_server="smtp.gmail.com"
        self.smtp_port=587
        self.email_address=Config.EMAIL
        self.email_password=Config.EMAILPASS

    def notify_user(self, recipient_email, file_name, secret):
        subject = "Capstone Project - File Upload"
        body = f"Hi, File {file_name} has been uploaded and shared with you. The secret is {secret} to download the file."
        self.send_email(recipient_email, subject, body)    

    def send_email(self, recipient_email, subject, body):
        msg = MIMEMultipart()
        msg['From'] = self.email_address
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_address, self.email_password)
            server.send_message(msg)
            print("Email sent successfully!")
        except Exception as e:
            print(f"Failed to send email. Error: {e}")
        finally:
            server.quit()
