from flask import Response
from flask_restful import Resource, abort, marshal, reqparse, request
from flask_restful import marshal_with, fields
from common.utils import parse_resource_fields
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
        finder.join('LEFT', 'profile')
        if tablename != 'hospital':
            finder = finder.join('LEFT', 'person', 'profile')
        entity_fields = parse_resource_fields(entity)
        resp_fields = {}
        res = None
        if id is not None:
            res = cls.fetch()
        else:
            print("getting all")
            res = cls.fetch('all')
            entity_fields = fields.List(entity_fields)
        resp_fields['results'] = entity_fields
        return marshal({'results': res}, resp_fields)
