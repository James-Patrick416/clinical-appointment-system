from flask import Flask, request, jsonify
from app import app, db
from models import User, Appointment, Clinic
from functools import wraps
import jwt

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Auth routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    
    user = User(
        name=data['name'],
        email=data['email'],
        role=data.get('role', 'patient')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = user.generate_token(app.config['SECRET_KEY'])
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = user.generate_token(app.config['SECRET_KEY'])
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200

# User routes
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'role': u.role
    } for u in users]), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    if current_user.id != user_id and current_user.role != 'admin':
        return jsonify({'message': 'Access denied'}), 403
    
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    }), 200

@app.route('/api/users/<int:user_id>', methods=['PATCH'])
@token_required
def update_user(current_user, user_id):
    if current_user.id != user_id and current_user.role != 'admin':
        return jsonify({'message': 'Access denied'}), 403
    
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400
        user.email = data['email']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

# Appointment routes
@app.route('/api/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    if current_user.role == 'patient':
        appointments = Appointment.query.filter_by(patient_id=current_user.id).all()
    elif current_user.role == 'doctor':
        appointments = Appointment.query.filter_by(doctor_id=current_user.id).all()
    else:  # admin
        appointments = Appointment.query.all()
    
    return jsonify([{
        'id': a.id,
        'patient_id': a.patient_id,
        'doctor_id': a.doctor_id,
        'clinic_id': a.clinic_id,
        'date': a.date,
        'time': a.time,
        'status': a.status,
        'notes': a.notes,
        'patient_name': a.patient.name,
        'doctor_name': a.doctor.name,
        'clinic_name': a.clinic_location.name
    } for a in appointments]), 200

@app.route('/api/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    if current_user.role != 'patient':
        return jsonify({'message': 'Only patients can create appointments'}), 403
    
    data = request.get_json()
    
    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=data['doctor_id'],
        clinic_id=data['clinic_id'],
        date=data['date'],
        time=data['time'],
        notes=data.get('notes', '')
    )
    
    db.session.add(appointment)
    db.session.commit()
    
    return jsonify({'message': 'Appointment created successfully', 'id': appointment.id}), 201

@app.route('/api/appointments/<int:appointment_id>', methods=['PATCH'])
@token_required
def update_appointment(current_user, appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    
    # Patients can only cancel, doctors/admin can update
    if current_user.role == 'patient' and current_user.id != appointment.patient_id:
        return jsonify({'message': 'Access denied'}), 403
    
    data = request.get_json()
    
    if 'status' in data:
        appointment.status = data['status']
    if 'notes' in data and current_user.role in ['doctor', 'admin']:
        appointment.notes = data['notes']
    if 'date' in data and current_user.role in ['doctor', 'admin']:
        appointment.date = data['date']
    if 'time' in data and current_user.role in ['doctor', 'admin']:
        appointment.time = data['time']
    
    db.session.commit()
    return jsonify({'message': 'Appointment updated successfully'}), 200

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    
    if current_user.role != 'admin' and current_user.id != appointment.patient_id:
        return jsonify({'message': 'Access denied'}), 403
    
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment deleted successfully'}), 200

# Clinic routes
@app.route('/api/clinics', methods=['GET'])
def get_clinics():
    clinics = Clinic.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'location': c.location,
        'phone': c.phone,
        'doctors': [{'id': d.id, 'name': d.name} for d in c.doctors]
    } for c in clinics]), 200

@app.route('/api/clinics', methods=['POST'])
@token_required
def create_clinic(current_user):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    clinic = Clinic(
        name=data['name'],
        location=data['location'],
        phone=data.get('phone', '')
    )
    
    db.session.add(clinic)
    db.session.commit()
    return jsonify({'message': 'Clinic created successfully', 'id': clinic.id}), 201

@app.route('/api/clinics/<int:clinic_id>', methods=['PATCH'])
@token_required
def update_clinic(current_user, clinic_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    clinic = Clinic.query.get_or_404(clinic_id)
    data = request.get_json()
    
    if 'name' in data:
        clinic.name = data['name']
    if 'location' in data:
        clinic.location = data['location']
    if 'phone' in data:
        clinic.phone = data['phone']
    
    db.session.commit()
    return jsonify({'message': 'Clinic updated successfully'}), 200

@app.route('/api/clinics/<int:clinic_id>', methods=['DELETE'])
@token_required
def delete_clinic(current_user, clinic_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    clinic = Clinic.query.get_or_404(clinic_id)
    db.session.delete(clinic)
    db.session.commit()
    return jsonify({'message': 'Clinic deleted successfully'}), 200

# Doctor-clinic assignment
@app.route('/api/clinics/<int:clinic_id>/doctors/<int:doctor_id>', methods=['POST'])
@token_required
def assign_doctor_to_clinic(current_user, clinic_id, doctor_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    clinic = Clinic.query.get_or_404(clinic_id)
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first_or_404()
    
    if doctor not in clinic.doctors:
        clinic.doctors.append(doctor)
        db.session.commit()
    
    return jsonify({'message': 'Doctor assigned to clinic successfully'}), 200

@app.route('/api/clinics/<int:clinic_id>/doctors/<int:doctor_id>', methods=['DELETE'])
@token_required
def remove_doctor_from_clinic(current_user, clinic_id, doctor_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    clinic = Clinic.query.get_or_404(clinic_id)
    doctor = User.query.filter_by(id=doctor_id, role='doctor').first_or_404()
    
    if doctor in clinic.doctors:
        clinic.doctors.remove(doctor)
        db.session.commit()
    
    return jsonify({'message': 'Doctor removed from clinic successfully'}), 200