# server/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Association table for Doctor <-> Clinic
doctor_clinic_association_table = db.Table(
    'doctor_clinic_association',
    db.Column('doctor_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('clinic_id', db.Integer, db.ForeignKey('clinics.id')),
    db.Column('specialty', db.String(100), nullable=True)
)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    patient_appointments = db.relationship(
        "Appointment",
        foreign_keys='Appointment.patient_id',
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    doctor_appointments = db.relationship(
        "Appointment",
        foreign_keys='Appointment.doctor_id',
        back_populates="doctor",
        cascade="all, delete-orphan"
    )
    
    clinics = db.relationship(
        'Clinic',
        secondary=doctor_clinic_association_table,
        back_populates='doctors'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Clinic(db.Model):
    __tablename__ = "clinics"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(255))

    doctors = db.relationship(
        "User", 
        secondary=doctor_clinic_association_table, 
        back_populates='clinics'
    )
    
class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(50), default="booked")

    patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    patient = db.relationship("User", foreign_keys=[patient_id], back_populates="patient_appointments")
    doctor = db.relationship("User", foreign_keys=[doctor_id], back_populates="doctor_appointments")