from datetime import datetime
from flask_restful import Resource, abort, reqparse, request
from models.appointment import Appointment

postparser = reqparse.RequestParser()
postparser.add_argument(
        'patient_id',
        type=str,
        help="Provide a guest id",
        required=True)
postparser.add_argument(
        'doctor_id',
        type=str,
        help="Provide a doctors id")
postparser.add_argument(
        'hospital_id',
        type=str,
        help="Provide a hospital id")
postparser.add_argument(
        'datetime',
        type=str,
        help="Missing Datetime",
        required=True)
postparser.add_argument('reason',
                        type=str,
                        help="provide a reason",
                        required=True)
postparser.add_argument('notes', type=str)

getparser = reqparse.RequestParser()
getparser.add_argument('doctor_id', type=str)
getparser.add_argument('guest_id', type=str)


class Appointments(Resource):
    def post(self):
        args = postparser.parse_args()
        ap = Appointment(**args)
        Appointment.insert_record(ap)
        Appointment.save()
        return "new appointment created"

    def get(self):
        '''
        Handles get request for appointments for particular doctor
        or patient
        returns list of appointments for entity
        '''
        args = getparser.parse_args()
        for k, v in args.items():
            if v is not None:
                Appointment.find(filters=k, filter_values=(v,))
                res = Appointment.fetch('all')
                return res
        abort(404, message='No records found for this user')
