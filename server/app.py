from flask import Flask
from flask_cors import CORS
from models import db
from schemas import ma
from config import Config  # ✅ Correct import

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)  # This will work now

db.init_app(app)
ma.init_app(app)

from routes import *

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)