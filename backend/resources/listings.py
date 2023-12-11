from flask import Response
from flask_restful import Resource, abort, marshal, reqparse, request
from flask_restful import marshal_with, fields
from models.hospital import Hospital
from models.doctor import Doctor
from models.profile import Profile


parser = reqparse.RequestParser()
parser.add_argument('profile', type=dict)
parser.add_argument('address', type=dict)
parser.add_argument('id', type=str, location='args')
get_parser = reqparse.RequestParser()
get_parser.add_argument('id', type=str, location='args')


class Listings(Resource):
    '''
    Handler for api calls to the listings endpoint
    handles get and put requests for doctors, hospitals
    and guests/patients
    '''
    classes = {'doctors': Doctor, 'hospitals': Hospital}

    def get(self, entity):
        '''
        Gets a lists of entity records in the db
        '''
        args = get_parser.parse_args()
        id = args['id']
        cls = self.classes[entity]
        tablename = f'{cls.__name__.lower()}'
        finder = None
        if id is not None:
            finder = cls.find(filter_values=(id,))
        else:
            finder = cls.find()
        if tablename != 'hospital':
            finder = finder.join('LEFT', 'person')
        profile_join = f'{tablename}.profile_id = profile.profile_id'
        finder.join('LEFT', 'profile', on=profile_join)
        res = None
        entity_fields = Listings.parse_resource_fields(entity)
        resp_fields = {}
        if id is not None:
            res = cls.fetch()
            resp_fields['results'] = fields.Nested(entity_fields)
        else:
            res = cls.fetch('all')
            resp_fields['results'] = fields.List(fields.Nested(entity_fields))
        return marshal({'results': res}, resp_fields)

    # def post(self, entity):
    #     '''
    #     Handles all post requests to listing endpoints
    #     adds the sent data to the entity's relation/table
    #     '''
    #     reqdata = request.json
    #     a = Profile(reqdata['email'])
    #     Profile.insert_record(a.__dict__)
    #     cls = Listings.classes[entity]
    #     del reqdata['email']
    #     key = None
    #     try:
    #         r = cls(**reqdata, profile_id=a.profile_id)
    #         key = getattr(r, f'{entity[:-1]}_id')
    #     except TypeError:
    #         abort(403, message='Bad request')
    #     cls.insert_record(r.__dict__)
    #     cls.save()
    #     return key or 'Something went wrong'

    def put(self, entity):
        '''
        Handle updates of an entity
        '''
        args = parser.parse_args()
        profile_columns = {}
        cls = self.classes[entity]
        for k, v in args.items():
            if v is None or k == 'id':
                continue
            match k:
                case 'address':
                    try:
                        a = self.classes[k](**v)
                        Address.insert_record(a.__dict__)
                        profile_columns['address_id'] = a.address_id
                    except Exception as e:
                        print(e)
                        abort(400, message=e)
                case 'profile':
                    profile_columns.update(v)
                case _:
                    self.classes[k].update_records(args['id'], v)

        if bool(profile_columns):
            cls.find(fields='profile_id',
                     filter_values=(args['id'],))
            profile_id = cls.fetch()['profile_id']
            Profile.update_records(profile_id, profile_columns)
        cls.save()
        return 'successfull update'

    @staticmethod
    def parse_resource_fields(entity: str):
        '''
        generates response fields depending on entity requested
        returns dictionary of flask_restful response fields
        '''
        res_fields = {}
        # fields shared by all entities
        base_fields = {
            f'{entity[:-1]}_id': fields.String,
            'acc_email': fields.String,
            'contact': fields.String,
            'profile_pic': fields.String,
        }

        # Fields shared by human entities
        person_entity_fields = {
            **base_fields,
            'first_name': fields.String,
            'last_name': fields.String,
            'gender': fields.String,
        }
        match entity:
            case 'doctors':
                res_fields.update({
                    **person_entity_fields,
                    'verified': fields.String,
                    'speciality': fields.String,
                })
            case 'guests':
                res_fields.update({**person_entity_fields})
            case _:
                res_fields.update({
                    **base_fields,
                    'hospital_name': fields.String
                })
        return res_fields
