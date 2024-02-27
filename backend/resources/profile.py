from common.utils import generate_jwt, parse_resource_fields, update_profile_image
import bcrypt
from flask_restful import Resource, abort, fields, marshal, reqparse, request
from models.person import Person
from models.account import Account
from models.doctor import Doctor
from models.patient import Patient
from models.hospital import Hospital
from models.profile import Profile
from resources.auth import authenticator
import os


parser = reqparse.RequestParser()
parser.add_argument('email', type=str, required=True, help='Missing Email')
parser.add_argument('password', type=str, required=True, help='missing Password')



doctor_parser = reqparse.RequestParser()
doctor_parser.add_argument('speciality',
                           type=str,
                           required=True,
                           help='Missing speciality')
doctor_parser.add_argument('hospital_name', type=str)
doctor_parser.add_argument('hospital_id', type=str)
doctor_parser.add_argument('license_num',
                           type=str,
                           required=True,
                           help='Missing license number')

hospital_parser = reqparse.RequestParser()
hospital_parser.add_argument('reg_number',
                             type=str,
                             required=True,
                             help='Missing registration number')
hospital_parser.add_argument('name', type=str, required=True, help='Missing hospital name')
patient_parser = reqparse.RequestParser()


class Profiles(Resource):
    method_decorators = {'put': [authenticator],
                         'patch': [authenticator],
                         'get': [authenticator]}
    arg_parsers = {
            'doctor_parser': doctor_parser,
            'hospital_parser': hospital_parser,
            'patient_parser': patient_parser }
    models = {
            'doctor': Doctor,
            'hospital': Hospital,
            'person': Person,
            'profile': Profile,
            'patient': Patient,
            'account': Account}

    def post(self, entity):
        '''
        handles request for creating new entity record
        '''
        tablename = entity[:-1]
        args = self.arg_parsers[f"{tablename}_parser"].parse_args()
        account = self.new_account(tablename)
        cls = self.models[tablename]
        obj = cls(**args)
        cls.insert_record(obj)
        Profile.save()
        payload = {**account, 'user_id': getattr(obj, f"{tablename}_id")}
        token = generate_jwt(payload)
        return { 'sessionToken': token }

    def put(self, user_info, entity):
        '''
        handles requests to complete existing entity with personal data
        '''
        person_id = None
        if entity != 'hospitals':
            person_id = self.new_person(user_info['user_id'])
        profile_id = self.profile_updates(person_id, user_info['account_id']) # creates a assiociated profile record
        print(entity)
        cls = self.models[entity[:-1]]
        cls.update_records(user_info['user_id'], {'profile_id': profile_id})
        cls.save()
        user_info['profile_id'] = profile_id
        token = generate_jwt(user_info)
        return {'sessionToken': token, 'user_id': user_info['user_id']}

    def get(self, user_info, entity):
        """
        gets full profile info for authenticated user
        """
        cls = self.models[entity[:-1]]
        finder = cls.find(filter_values=(user_info["user_id"],))
        finder.join("INNER", "profile")
        if entity != "hospitals":
            finder.join("INNER", "person", "profile")
        res = Profile.fetch()
        resp_fields = {}
        resp_fields["results"] = parse_resource_fields(entity)
        return marshal({'results': res}, resp_fields)

    def patch(self, user_info, entity):
        '''
        payload: {user_id: string, account_id: string}
            jwt token payload passed by authenticator decorator
            contains authenticated user info
        Method is used for updating user profile data and settings
        '''
        data = None
        if request.headers["Content-Type"] != 'application/json':
            file = request.files["file"]
            image_url = update_profile_image("doctor", file)
            data = {'profile': {'picture': image_url}}
        else:
            data = request.json
        if data is None or len(data.keys()) == 0:
            return abort(400, message="Something missing inn your request")
        for k, v in data.items():
            record_id = user_info[ f"{k}_id" if k in ['profile', 'account'] else "user_id"]
            cls = self.models[k]
            cls.update_records(record_id, v)
            Profile.save()
        return {'message': 'successful settings update'}

    def new_account(self, account_type):
        args = parser.parse_args()
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(args['password'].encode('utf-8'), salt)
        a = Account(args['email'], hashed_pw.decode('utf-8'), account_type=account_type)
        Account.insert_record(a)
        return {'account_id': a.account_id, 'email': a.email, 'account_type': account_type}

    def new_person(self, user_id):
        doc_args = ['first_name', 'last_name', 'gender']
        person_parser = reqparse.RequestParser()
        for arg in doc_args:
            person_parser.add_argument(arg, type=str, required=True, help=f"Missing {arg}")
        args = person_parser.parse_args()
        p = Person(user_id, **args)
        Person.insert_record(p)
        Person.save()
        return p.person_id

    def profile_updates(self, person_id, account_id):
        '''
        creates a new profile with field data provided with request body
        body payload is extracted as profile_args, parsed and used for new
        profile object, then inserted into profile table
        returns profile object for use by entity
        '''
        expected_args = ['state', 'city', 'address', 'contact_one', 'contact_two']

        profile_args = reqparse.RequestParser()
        for arg in expected_args:
            required = False if arg == 'contact' else True
            profile_args.add_argument(arg,
                                      type=str,
                                      required=required,
                                      help=f'Missing {arg}')
        args = profile_args.parse_args()
        prf = Profile(**args, person_id=person_id, account_id=account_id)
        Profile.insert_record(prf)
        Profile.save()
        return prf.profile_id
