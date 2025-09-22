# server/config.py
import os

class Config:
    """Base config"""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///hospital.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.environ.get("DEBUG", True)


class DevelopmentConfig(Config):
    """Local dev config"""
    DEBUG = True


class ProductionConfig(Config):
    """Production config"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class TestingConfig(Config):
    """Testing config"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
