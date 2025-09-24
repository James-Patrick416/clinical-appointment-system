from marshmallow import Schema, fields
from .user import UserSchema

class ClinicSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    location = fields.Str()
    doctors = fields.List(fields.Nested(UserSchema), dump_only=True)
