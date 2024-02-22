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
