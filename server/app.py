from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Clinic, Appointment
from schemas.user import UserSchema
from schemas.clinic import ClinicSchema
from schemas.appointment import AppointmentSchema
from auth import generate_token, token_required
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)
appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)

# ----------------- Home -----------------
@app.route('/')
def home():
    return {"message": "Clinic API is running"}

# ----------------- Auth Endpoints -----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    return jsonify({'token': token})

# ----------------- User Endpoints -----------------
@app.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    return users_schema.jsonify(users)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    password_hash = generate_password_hash(data['password'])
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        role=data['role'],
        clinic_id=data.get('clinic_id')
    )
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user), 201

# ----------------- Clinic Endpoints -----------------
@app.route('/clinics', methods=['GET'])
@token_required
def get_clinics(current_user):
    clinics = Clinic.query.all()
    return clinics_schema.jsonify(clinics)

@app.route('/clinics', methods=['POST'])
@token_required
def create_clinic(current_user):
    data = request.get_json()
    errors = clinic_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    clinic = Clinic(
        name=data['name'],
        location=data.get('location')
    )
    db.session.add(clinic)
    db.session.commit()
    return clinic_schema.jsonify(clinic), 201

# ----------------- Appointment Endpoints -----------------
@app.route('/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    appointments = Appointment.query.all()
    return appointments_schema.jsonify(appointments)

@app.route('/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    errors = appointment_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    appointment = Appointment(
        date_time=data['date_time'],
        patient_id=data['patient_id'],
        doctor_id=data['doctor_id'],
        status=data.get('status', 'booked')
    )
    db.session.add(appointment)
    db.session.commit()
    return appointment_schema.jsonify(appointment), 201

if __name__ == '__main__':
    app.run(debug=True)
