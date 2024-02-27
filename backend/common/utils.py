from flask_restful import fields
from firebase import firebase_admin, upload_image
import jwt
import time
import math
import os


def generate_jwt(payload):
    payload['exp'] = (math.floor(time.time()) + 82400) * 1000
    from app import config
    token = jwt.encode(payload, config['SECRET_KEY'], algorithm="HS256")
    return token


def update_profile_image(cls, file):
    from app import app
    localfile = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(localfile)
    image_url = upload_image(file.filename, localfile)
    return image_url


def parse_resource_fields(entity: str):
    '''
    generates response fields depending on entity requested
    returns dictionary of flask_restful response fields
    '''
    res_fields = {}
    # fields shared by all entities
    base_fields = {
        f'{entity[:-1]}_id': fields.String,
        'email': fields.String,
        'contact_one': fields.String,
        'contact_two': fields.String,
        'state': fields.String,
        'city': fields.String,
        'address': fields.String,
        'picture': fields.String,
    }

    # Fields shared by human entities
    person_entity_fields = {
        **base_fields,
        'first_name': fields.String,
        'last_name': fields.String,
        'gender': fields.String,
    }
    match entity:
        case 'doctors':
            res_fields.update({
                **person_entity_fields,
                'verified': fields.String,
                'hospital_name': fields.String,
                'speciality': fields.String,
            })
        case 'patients':
            res_fields.update({**person_entity_fields})
        case _:
            res_fields.update({
                **base_fields,
                'hospital_name': fields.String
            })
    return fields.Nested(res_fields)
