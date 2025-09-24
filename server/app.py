from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, Appointment, Clinic, doctor_clinic_association_table
from schemas.__init__ import user_schema, users_schema, clinic_schema, clinics_schema, appointment_schema, appointments_schema
from auth import token_required, generate_token
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

# Initialize app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)


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


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User with that email already exists'}), 409
    
    password_hash = generate_password_hash(data['password'])
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        role=data['role'],
    )
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user), 201


# ----------------- User Endpoints -----------------
@app.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    return users_schema.jsonify(users)

@app.route('/users', methods=['POST'])
@token_required
def create_user(current_user):
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    user = user_schema.load(data)
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user), 201

@app.route('/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def user_by_id(current_user, id):
    user = User.query.get_or_404(id)
    if request.method == 'GET':
        return user_schema.jsonify(user)
    elif request.method == 'PATCH':
        data = request.get_json()
        errors = user_schema.validate(data, partial=True)
        if errors:
            return jsonify(errors), 400
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return user_schema.jsonify(user)
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return '', 204


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
    clinic = clinic_schema.load(data)
    db.session.add(clinic)
    db.session.commit()
    return clinic_schema.jsonify(clinic), 201

@app.route('/clinics/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def clinic_by_id(current_user, id):
    clinic = Clinic.query.get_or_404(id)
    if request.method == 'GET':
        return clinic_schema.jsonify(clinic)
    elif request.method == 'PATCH':
        data = request.get_json()
        errors = clinic_schema.validate(data, partial=True)
        if errors:
            return jsonify(errors), 400
        for key, value in data.items():
            setattr(clinic, key, value)
        db.session.commit()
        return clinic_schema.jsonify(clinic)
    elif request.method == 'DELETE':
        db.session.delete(clinic)
        db.session.commit()
        return '', 204


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
    appointment = appointment_schema.load(data)
    db.session.add(appointment)
    db.session.commit()
    return appointment_schema.jsonify(appointment), 201

@app.route('/appointments/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def appointment_by_id(current_user, id):
    appointment = Appointment.query.get_or_404(id)
    if request.method == 'GET':
        return appointment_schema.jsonify(appointment)
    elif request.method == 'PATCH':
        data = request.get_json()
        errors = appointment_schema.validate(data, partial=True)
        if errors:
            return jsonify(errors), 400
        for key, value in data.items():
            setattr(appointment, key, value)
        db.session.commit()
        return appointment_schema.jsonify(appointment)
    elif request.method == 'DELETE':
        db.session.delete(appointment)
        db.session.commit()
        return '', 204

# ----------------- Many-to-Many Endpoints (Doctor-Clinic) -----------------
@app.route('/clinics/<int:clinic_id>/doctors', methods=['POST'])
@token_required
def assign_doctor_to_clinic(current_user, clinic_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    doctor_id = data.get('doctor_id')
    specialty = data.get('specialty')

    clinic = Clinic.query.get_or_404(clinic_id)
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first_or_404()
    
    stmt = doctor_clinic_association_table.insert().values(
        doctor_id=doctor.id, clinic_id=clinic.id, specialty=specialty
    )
    db.session.execute(stmt)
    db.session.commit()
    
    return jsonify({'message': 'Doctor assigned to clinic successfully'}), 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)