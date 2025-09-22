from flask_marshmallow import Marshmallow
from models import User, Appointment, Clinic

ma = Marshmallow()

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        load_instance = True
        include_fk = True  # This will include the foreign key fields like patient_id, doctor_id

    # Define these fields manually. Use a Method field to get the name from the relationship.
    patient_name = ma.Method("get_patient_name")
    doctor_name = ma.Method("get_doctor_name")
    clinic_name = ma.Method("get_clinic_name")

    def get_patient_name(self, obj):
        # 'obj' is the Appointment instance
        return obj.patient.name if obj.patient else None

    def get_doctor_name(self, obj):
        return obj.doctor.name if obj.doctor else None

    def get_clinic_name(self, obj):
        return obj.clinic_location.name if obj.clinic_location else None

class ClinicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Clinic
        load_instance = True

    doctors = ma.Nested(UserSchema, many=True, only=('id', 'name'))

# Schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)
clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)