from flask_restful import Resource, reqparse, request
from models.person import Person
from models.account import Account
from models.doctor import Doctor
from models.hospital import Hospital
from models.profile import Profile
import bcrypt

parser = reqparse.RequestParser()
parser.add_argument('email', type=str, required=True, help='Missing Email')
parser.add_argument('password', type=str, required=True, help='missing Password')

put_parser = reqparse.RequestParser()


class Register(Resource):
    def post(self, entity):
        '''
        handles initial registrations request
        '''
        # match entity:
        #     case 'doctors':
        pass


class DoctorResource(Resource):
    post_parser = parser.copy()
    post_parser.add_argument('speciality',
                             type=str,
                             required=True,
                             help='Missing speciality')
    post_parser.add_argument('hospital_name', type=str)
    post_parser.add_argument('hospital_id', type=str)
    post_parser.add_argument('license_num',
                             type=str,
                             required=True,
                             help='Missing license number')

    def post(self):
        '''
        handles post request to doctors route
        method handles creating new doctor
        '''
        args = self.post_parser.parse_args()
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(args['password'].encode('utf8'), salt)
        a = Account(args['email'], hashed_pw, acc_type='doctor')
        del args['email']
        del args['password']
        d = Doctor(**args, account_id=a.account_id)
        Account.insert_record(a)
        Doctor.insert_record(d)
        Doctor.save()
        return d.doctor_id

    def put(self):
        expected_args = ['last_name',
                         'first_name',
                         'gender',
                         'state',
                         'city',
                         'address',
                         'contact']
        for arg in expected_args:
            required = False if arg == 'contact' else True
            put_parser.add_argument(arg,
                                    type=str,
                                    required=required,
                                    help=f'Missing {arg}')
            put_parser.add_argument('id',
                                    type=str,
                                    required=True,
                                    help='Missing Doctor id',
                                    location='args')
        args = put_parser.parse_args()
        p = Person(args['first_name'], args['last_name'], args['gender'])
        Person.insert_record(p)
        prf = Profile(*[args[arg] for arg in expected_args[3:]])
        Profile.insert_record(prf)
        updates = {'profile_id': prf.profile_id, 'person_id': p.person_id}
        Doctor.update_records(args['id'], updates)
        Doctor.save()
        return 'success'
