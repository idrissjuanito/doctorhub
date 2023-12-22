from flask_restful import Resource, reqparse, request
from models.person import Person
from models.account import Account
from models.doctor import Doctor
from models.hospital import Hospital
from models.profile import Profile
from common.utils import generate_jwt
from resources.auth import authenticator
import bcrypt


parser = reqparse.RequestParser()
parser.add_argument('email', type=str, required=True, help='Missing Email')
parser.add_argument('password', type=str, required=True, help='missing Password')

profile_args = reqparse.RequestParser()


class ProfileCommon(Resource):
    classes = {'doctor': Doctor, 'hospital': Hospital}

    @classmethod
    def profile_updates(cls):
        '''
        handles common update tasks for any entity with a profile
        '''
        expected_args = ['state', 'city', 'address', 'contact_one', 'contact_two']

        for arg in expected_args:
            required = False if arg == 'contact' else True
            profile_args.add_argument(arg,
                                      type=str,
                                      required=required,
                                      help=f'Missing {arg}')
        args = profile_args.parse_args()
        prf = Profile(*[args[arg] for arg in expected_args])
        Profile.insert_record(prf)
        return prf

    @classmethod
    def new_account(cls, account_type):
        args = parser.parse_args()
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(args['password'].encode('utf-8'), salt)
        a = Account(args['email'], hashed_pw.decode('utf-8'), acc_type=account_type)
        Account.insert_record(a)
        return {'account_id': a.account_id, 'email': a.email}


class DoctorResource(ProfileCommon):
    method_decorators = {'put': [authenticator]}
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

    def post(self):
        '''
        handles post request to doctors route
        method handles creating new doctor
        '''
        args = self.doctor_parser.parse_args()
        account = ProfileCommon.new_account('doctor')
        d = Doctor(**args, account_id=account['account_id'])
        Doctor.insert_record(d)
        Doctor.save()
        payload = {**account, 'user_id': d.doctor_id}
        token = generate_jwt(payload)
        return {'sessionToken': token, 'user_id': d.doctor_id}

    def put(self, current_user):
        doc_args = ['id', 'first_name', 'last_name', 'gender']
        for arg in doc_args:
            profile_args.add_argument(arg, type=str, required=True, help=f"Missing {arg}")
        args = profile_args.parse_args()
        if current_user['user_id'] != args['id']:
            abort(400, "Bad Request")
        p = Person(args['first_name'], args['last_name'], args['gender'])
        Person.insert_record(p)
        prf: Profile = ProfileCommon.profile_updates()
        updates = {'profile_id': prf.profile_id, 'person_id': p.person_id}
        Doctor.update_records(args['id'], updates)
        Doctor.save()
        return 'updates successful'


class HospitalResource(ProfileCommon):
    '''
    Hospital resource
    handles request for various methods to hospital profile
    '''
    hospital_parser = reqparse.RequestParser()
    hospital_parser.add_argument('reg_number',
                                 type=str,
                                 required=True,
                                 help='Missing registration number')
    hospital_parser.add_argument('name',
                                 type=str,
                                 required=True,
                                 help='Missing hospital name')

    def get(self, payload):
        '''
        gets information of a logged in hospital user
        decorator handles authorization
        '''
        print(payload)


    def post(self):
        '''
        handles post request to the hospital profile
        creates a new hospital record
        '''
        args = self.hospital_parser.parse_args()
        account_id = ProfileCommon.new_account()
        h = Hospital(**args, account_id=account_id)
        Hospital.insert_record(h)
        Hospital.save()
        return h.hospital_id

    def put(self):
        '''
        put method used when updating profile data
        '''
        ProfileCommon.updates('hospital')
        return 'updates successful'
