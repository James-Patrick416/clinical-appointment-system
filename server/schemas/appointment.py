from marshmallow import Schema, fields

class AppointmentSchema(Schema):
    id = fields.Int(dump_only=True)
    date_time = fields.DateTime(required=True)
    status = fields.Str()
    patient_id = fields.Int(required=True)
    doctor_id = fields.Int(required=True)
