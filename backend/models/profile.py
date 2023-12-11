from uuid import uuid4
from db.dbmanager import DBManager, relationship


class Profile(DBManager):
    _tablename = 'profile'
    profile_id = 'uuid PRIMARY KEY'
    contact = 'varchar(15)'
    picture = 'varchar(100)'
    state = 'varchar(30) NOT NULL'
    city = 'varchar(30) NOT NULL'
    address = 'varchar(30) NOT NULL'

    def __init__(self,
                 state: str,
                 city: str,
                 address: str,
                 contact=None,
                 picture=None):
        self.profile_id = str(uuid4())
        self.picture = picture
        self.contact = contact
        self.state = state
        self.city = city
        self.address = address
