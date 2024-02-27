from uuid import uuid4
from models.profile import Profile
from db.dbmanager import DBManager, relationship


class Patient(DBManager):
    _tablename = 'patient'
    patient_id = 'uuid PRIMARY KEY'
    profile_id = relationship(Profile, 'CASCADE')

    def __init__(self):
        self.patient_id = str(uuid4())
        self.profile_id = None
