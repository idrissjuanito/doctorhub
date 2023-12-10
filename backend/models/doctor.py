from db.dbmanager import DBManager, relationship
from models.profile import Profile
from models.hospital import Hospital
from models.person import Person


class Doctor(Person):
    _tablename = 'doctor'
    doctor_id = relationship(Person, 'person_id') + ' PRIMARY KEY'
    profile_id = relationship(Profile, 'profile_id')
    speciality = 'varchar(50) NOT NULL'
    verified = 'boolean DEFAULT false'
    hospital_id = relationship(Hospital, 'hospital_id')

    def __init__(self,
                 first_name: str,
                 last_name: str,
                 gender: str,
                 speciality: str,
                 profile_id: str):
        super().__init__(first_name, last_name, gender)
        self.doctor_id = super()._person_id
        self.profile_id = profile_id
        self.speciality = speciality
