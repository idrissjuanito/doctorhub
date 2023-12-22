from flask import config
from flask_restful import Resource, abort, reqparse, request
from models.account import Account
from models.doctor import Doctor
from models.hospital import Hospital
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
            Account.find(fields='account_id', filter_values=(payload['account_id'],))
            user = Account.fetch()
            return func(payload)
        except DecodeError or InvalidTokenError:
            abort(401, message='unauthorized request')
    return wrapper


class Auth(Resource):
    method_decorators = {'get': [authenticator]}
    account_types = {'doctor': Doctor, 'hospital': Hospital}

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
        if account is None:
            abort(404, message="No user found")
        pw = account['password'].encode('utf-8')
        if bcrypt.checkpw(args['password'].encode('utf-8'), pw):
            user_model = self.account_types[account['acc_type']]
            user_model.find(
                    fields=f'{account["acc_type"]}_id',
                    filters='account_id',
                    filter_values=(account['account_id'],))
            user_id = user_model.fetch()
            user_id = user_id[f'{account["acc_type"]}_id']
            payload = {
                'user_id': user_id,
                'account_id': account['account_id'],
                'email': account['email']
            }
            token = generate_jwt(payload)
            return {'accessToken': token, 'user_id': user_id}
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
