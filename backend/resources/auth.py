from flask import session
from flask_restful import Resource, abort, reqparse


login_parser = reqparse.RequestParser()
login_parser.add_argument('username', type=str, help='username missing')
login_parser.add_argument('email', type=str, help='Email Missing')
login_parser.add_argument('password',
                          type=str,
                          help='Password Missing',
                          required=True)


def authenticator(func):
    def wrapper(*args, **kwargs):
        if True:
            return 'not authenticated'
        return func()
    return wrapper


class Auth(Resource):
    method_decorators = [authenticator]

    def get(self):
        return "Authenticator"

    def post(self):
        '''
        handles login request
        '''
        args = login_parser.parse_args()
        if not self.validate_logins(args):
            abort(400, message='Bad request missing login data')


    @staticmethod
    def validate_logins(logins: dict):
        '''
        validates the content of logins details sent to login route
        '''
        if len(logins.keys()) != 2:
            abort(400, message='Unexpected number of logins')
        if 'email' not in logins.keys() or 'username' not in logins.keys():
            return False
        return True
