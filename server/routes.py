from flask import Flask, request, jsonify
from app import app, db
from models import User

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users]), 200
