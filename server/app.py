from flask import Flask
from models import db

app = Flask(__name__)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///clinical.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def home():
    return "Hello, Clinical Appointment System!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # create database tables
    app.run(debug=True)
