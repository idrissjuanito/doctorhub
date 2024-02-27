from models.patient import Patient
from models.profile import Profile
from flask import config
from flask_restful import Resource, abort, reqparse, request
from models.account import Account
from flask_cors import decorator
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
            return func(*args, payload, **kwargs)
        except DecodeError or InvalidTokenError:
            abort(401, message='unauthorized request')
    return wrapper


class Auth(Resource):
    method_decorators = {'get': [authenticator]}
    account_types = {'doctor': Doctor, 'hospital': Hospital, 'patient': Patient}

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
        print(account)
        if account is None:
            return abort(404, message="No user found")
        account_type = account['account_type']
        pw = account['password'].encode('utf-8')
        if bcrypt.checkpw(args['password'].encode('utf-8'), pw):
            user_model = self.account_types[account_type]
            finder = user_model.find(
                    fields=f'{account_type}_id, {account_type}.profile_id profile',
                    filters='account_id',
                    filter_values=(account['account_id'],))
            finder.join('INNER', 'profile')
            user = Profile.fetch()
            if user is None:
                abort(500, message='Something went wrong')
            payload = {
                'user_id': user[f'{account_type}_id'] ,
                'profile_id': user['profile'],
                'account_id': account['account_id'],
                'email': account['email'],
                'account_type': account_type
            }
            token = generate_jwt(payload)
            return { 'sessionToken': token }
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
