from uuid import uuid4
from db.dbmanager import DBManager, relationship


class Profile(DBManager):
    _tablename = 'profile'
    profile_id = 'uuid PRIMARY KEY'
    contact_one = 'varchar(15)'
    contact_two = 'varchar(15)'
    picture = 'varchar(255)'
    state = 'varchar(30) NOT NULL'
    city = 'varchar(30) NOT NULL'
    address = 'varchar(30) NOT NULL'

    def __init__(self,
                 state: str,
                 city: str,
                 address: str,
                 contact_one=None,
                 contact_two=None,
                 picture=None):
        self.profile_id = str(uuid4())
        self.picture = picture
        self.contact_one = contact_one
        self.contact_two = contact_two
        self.state = state
        self.city = city
        self.address = address
