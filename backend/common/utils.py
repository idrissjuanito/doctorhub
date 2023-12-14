import jwt
import time


def generate_jwt(payload):
    payload['exp'] = time.time() + 82600
    from app import config
    token = jwt.encode(payload, config['SECRET_KEY'], algorithm="HS256")
    return token
