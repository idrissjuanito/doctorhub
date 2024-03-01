from datetime import datetime
from flask_restful import Resource, abort, reqparse, request
from resources.auth import authenticator
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
getparser.add_argument('appointment_id', type=str, location='args')


class Appointments(Resource):
    method_decorators = {'get': [authenticator]}
    def post(self):
        args = postparser.parse_args()
        ap = Appointment(**args)
        Appointment.insert_record(ap)
        Appointment.save()
        return "new appointment created"

    def get(self, user_info):
        '''
        Handles get request for appointments for particular doctor
        or patient
        returns list of appointments for entity
        '''
        args = getparser.parse_args()
        apptmnt = None
        if args["appointment_id"]:
            Appointment.find(filter_values=(args["appointment_id"],))
            apptmnt = Appointment.fetch()
            print(apptmnt)
        else:
            Appointment.find(f'{user_info["account_type"]}_id',
                             filter_values=(user_info["user_id"],))
            apptmnt = Appointment.fetch("all")
        if apptmnt is None:
            abort(404, message='No records found for this user')
        return {"results": apptmnt}
