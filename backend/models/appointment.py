from datetime import datetime
from uuid import uuid4
from db.dbmanager import DBManager, relationship
from models.hospital import Hospital
from models.doctor import Doctor
from models.guest import Guest


class Appointment(DBManager):
    _tablename = 'appointment'
    appointment_id = 'uuid PRIMARY KEY'
    doctor_id = relationship(Doctor, 'doctor_id')
    guest_id = relationship(Guest, 'guest_id')
    hospital_id = relationship(Hospital, 'hospital_id')
    reason = 'varchar(255) NOT NULL'
    ap_date = 'varchar(100) NOT NULL'

    def __init__(self,
                 doctor_id: str,
                 guest_id: str,
                 hospital_id: str,
                 reason: str,
                 date: datetime):
        self.appointment_id = str(uuid4())
        self.doctor_id = doctor_id
        self.reason = reason
        self.guest_id = guest_id
        self.hospital_id = hospital_id
        self.ap_date = date
