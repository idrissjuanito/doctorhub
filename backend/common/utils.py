import jwt
import time
import math


def generate_jwt(payload):
    payload['exp'] = (math.floor(time.time()) + 82400) * 1000
    from app import config
    token = jwt.encode(payload, config['SECRET_KEY'], algorithm="HS256")
    return token
