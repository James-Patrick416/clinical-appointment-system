from flask_marshmallow import Marshmallow
from models import User, Appointment, Clinic
from marshmallow import fields

ma = Marshmallow()

class UserSchema(ma.SQLAlchemyAutoSchema):
    password = fields.String(load_only=True, required=True)
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        exclude = ('password_hash',)

class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        load_instance = True
        include_fk = True

    patient_name = ma.Method("get_patient_name")
    doctor_name = ma.Method("get_doctor_name")

    def get_patient_name(self, obj):
        return obj.patient.name if obj.patient else None

    def get_doctor_name(self, obj):
        return obj.doctor.name if obj.doctor else None

class ClinicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Clinic
        load_instance = True
    
    doctors = ma.Nested(UserSchema, many=True, only=('id', 'name', 'email'))

# Schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)
clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)