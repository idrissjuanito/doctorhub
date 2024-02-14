from flask_restful import Resource, abort, reqparse, request
from models.person import Person
from models.account import Account
from models.doctor import Doctor
from models.hospital import Hospital
from models.profile import Profile
from common.utils import generate_jwt
from resources.auth import authenticator
from firebase import firebase_admin, upload_image
import os
import bcrypt


parser = reqparse.RequestParser()
parser.add_argument('email', type=str, required=True, help='Missing Email')
parser.add_argument('password', type=str, required=True, help='missing Password')

profile_args = reqparse.RequestParser()


class ProfileCommon(Resource):
    @authenticator
    def patch(self, user_info):
        '''
        payload: {user_id: string, account_id: string}
            jwt token payload passed by authenticator decorator
            contains authenticated user info
        Method is used for updating user profile data and settings
        '''
        models = {'doctor': Doctor, 'hospital': Hospital, 'person': Person, 'profile': Profile, 'account': Account}
        data = None
        if request.headers["Content-Type"] != 'application/json':
            image_url = ProfileCommon.update_profile_image("doctor", user_info["user_id"])
            data = {'profile': {'picture': image_url}}
        else:
            data = request.json
        if data is None or len(data.keys()) == 0:
            return abort(400, message="Something missing inn your request")
        for k, v in data.items():
            record_id = user_info[ f"{k}_id" if k in ['profile', 'account'] else "user_id"]
            models[k].update_records(record_id, v)
            models[k].save()
        return {'message': 'successful settings update'}

    @classmethod
    def profile_updates(cls):
        '''
        creates a new profile with field data provided with request body
        body payload is extracted as profile_args, parsed and used for new
        profile object, then inserted into profile table
        returns profile object for use by entity
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
        return prf.profile_id

    @classmethod
    def new_account(cls, account_type):
        args = parser.parse_args()
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(args['password'].encode('utf-8'), salt)
        a = Account(args['email'], hashed_pw.decode('utf-8'), acc_type=account_type)
        Account.insert_record(a)
        return {'account_id': a.account_id, 'email': a.email}

    @classmethod
    def update_profile_image(cls, model, user_id):
        from app import app
        file = request.files["file"]
        localfile = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        print(localfile)
        file.save(localfile)
        image_url = upload_image(file.filename, localfile)
        return image_url



class DoctorResource(ProfileCommon):
    method_decorators = {'put': [authenticator]}
    model = Doctor
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
        '''
        updates a newly created doctor with his personal info
        instantiates new person object with provided info
        '''
        doc_args = ['id', 'first_name', 'last_name', 'gender']
        for arg in doc_args:
            profile_args.add_argument(arg, type=str, required=True, help=f"Missing {arg}")
        args = profile_args.parse_args()
        if current_user['user_id'] != args['id']:
            abort(400, message="Bad Request")
        p = Person(args['first_name'], args['last_name'], args['gender'])
        Person.insert_record(p)
        profile_id = ProfileCommon.profile_updates() # creates a assiociated profile record
        updates = {'profile_id': profile_id, 'person_id': p.person_id}
        Doctor.update_records(args['id'], updates) # update doctor table with associated profile and person ids
        Doctor.save()
        current_user['profile_id'] = profile_id
        token = generate_jwt(current_user)
        return {'sessionToken': token, 'user_id': args['id']}



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
        ProfileCommon.profile_updates()
        return 'updates successful'
