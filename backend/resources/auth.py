from flask import config
from flask_restful import Resource, abort, reqparse, request
from models.account import Account
from common.utils import generate_jwt
from jwt.exceptions import DecodeError, InvalidTokenError
import bcrypt
import jwt


login_parser = reqparse.RequestParser()
login_parser.add_argument('email', type=str, help='Email Missing')
login_parser.add_argument('password',
                          type=str,
                          help='Password Missing',
                          required=True)


def authenticator(func):
    def wrapper(*args, **kwargs):
        from app import config
        auth_header = request.headers['Authorization']
        if not auth_header:
            abort(400, message='Missing auth headers')
        token = auth_header.split()[1]
        try:
            payload = jwt.decode(token, config['SECRET_KEY'], algorithms='HS256')
            return func(payload)
        except DecodeError or InvalidTokenError:
            abort(401, message='unauthorized request')
    return wrapper


class Auth(Resource):
    method_decorators = {'get': [authenticator]}

    def get(self, payload):
        print(payload)
        return "Authenticator"

    def post(self):
        '''
        handles login request
        '''
        args = login_parser.parse_args()
        if not self.validate_logins(args):
            abort(400, message='Bad request missing login data')
        Account.find(filters='email', filter_values=(args['email'],))
        account = Account.fetch()
        pw = account['password'].encode('utf-8')
        if bcrypt.checkpw(args['password'].encode('utf-8'), pw):
            payload = {'account_id': account['account_id'], 'acc_type': account['acc_type']}
            token = generate_jwt(payload)
            return token
        return 'Not Good'

    @staticmethod
    def validate_logins(logins: dict):
        '''
        validates the content of logins details sent to login route
        '''
        if len(logins.keys()) != 2:
            abort(400, message='Unexpected number of logins')
        if 'email' not in logins.keys():
            return False
        return True
