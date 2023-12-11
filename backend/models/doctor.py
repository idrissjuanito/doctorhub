from uuid import uuid4
from models.profile import Profile
from models.account import Account
from db.dbmanager import DBManager, relationship
from models.hospital import Hospital
from models.person import Person


class Doctor(Person):
    _tablename = 'doctor'
    doctor_id = 'uuid PRIMARY KEY'
    person_id = relationship(Person, 'person_id')
    profile_id = relationship(Profile, 'profile_id')
    speciality = 'varchar(50) NOT NULL'
    license_num = 'varchar(100) NOT NULL UNIQUE'
    verified = 'boolean DEFAULT false'
    hospital_name = 'varchar(100)'
    hospital_id = relationship(Hospital, 'hospital_id')
    account_id = relationship(Account, 'account_id')

    def __init__(self,
                 speciality: str,
                 license_num: str,
                 account_id: str,
                 hospital_name=None,
                 hospital_id=None):
        self.doctor_id = str(uuid4())
        self.account_id = account_id
        self.person_id = None
        self.profile_id = None
        self.speciality = speciality
        self.license_num = license_num
        self.hospital_name = hospital_name
        self.hospital_id = hospital_id
        self.verified = None
