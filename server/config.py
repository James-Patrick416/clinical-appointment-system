import os

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///clinical.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "your-secret-key-here-change-in-production"