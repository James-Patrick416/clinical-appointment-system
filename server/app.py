from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Clinic, Appointment
from schemas.user import UserSchema
from schemas.clinic import ClinicSchema
from schemas.appointment import AppointmentSchema

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

# Schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)
appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)

# Home route
@app.route('/')
def home():
    return {"message": "Clinic API is running"}

# ----------------- User routes -----------------
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return users_schema.jsonify(users)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        clinic_id=data.get('clinic_id')
    )
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user), 201

# ----------------- Clinic routes -----------------
@app.route('/clinics', methods=['GET'])
def get_clinics():
    clinics = Clinic.query.all()
    return clinics_schema.jsonify(clinics)

@app.route('/clinics', methods=['POST'])
def create_clinic():
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

# ----------------- Appointment routes -----------------
@app.route('/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return appointments_schema.jsonify(appointments)

@app.route('/appointments', methods=['POST'])
def create_appointment():
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
