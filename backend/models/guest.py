from db.dbmanager import DBManager, relationship
from models.profile import Profile
from models.person import Person


class Guest(Person):
    _tablename = 'guest'
    guest_id = relationship(Person, 'person_id') + ' PRIMARY KEY'
    profile_id = relationship(Profile, 'profile_id')

    def __init__(self, first_name: str,
                 last_name: str,
                 gender: str,
                 profile_id: str):
        super().__init__(first_name, last_name, gender)
        self.guest_id = super()._person_id
        self.profile_id = profile_id
