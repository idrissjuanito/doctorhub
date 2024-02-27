from datetime import datetime
from uuid import uuid4
from models.patient import Patient
from models.person import Person
from db.dbmanager import DBManager, relationship
from models.hospital import Hospital
from models.doctor import Doctor


class Appointment(DBManager):
    _tablename = 'appointment'
    appointment_id = 'uuid PRIMARY KEY'
    doctor_id = relationship(Doctor)
    patient_id = relationship(Patient, 'CASCADE')
    hospital_id = relationship(Hospital)
    reason = 'varchar(255) NOT NULL'
    patient_notes = 'varchar(2048)'
    status = "varchar(15) DEFAULT 'scheduled'"
    datetime = 'varchar(100) NOT NULL'

    def __init__(self,
                 doctor_id: str,
                 patient_id: str,
                 datetime: str,
                 reason: str,
                 notes = None,
                 status = None,
                 hospital_id = None):
        self.appointment_id = str(uuid4())
        self.doctor_id = doctor_id
        self.reason = reason
        self.status = status
        self.patient_notes = notes
        self.patient_id = patient_id
        self.hospital_id = hospital_id
        self.datetime = datetime
