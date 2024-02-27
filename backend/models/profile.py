from uuid import uuid4
from models.account import Account
from models.person import Person
from db.dbmanager import DBManager, relationship


class Profile(DBManager):
    _tablename = 'profile'
    profile_id = 'uuid PRIMARY KEY'
    account_id = relationship(Account, 'CASCADE')
    person_id = relationship(Person, 'CASCADE')
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
                 person_id: str,
                 account_id: str,
                 contact_one=None,
                 contact_two=None,
                 picture=None):
        self.profile_id = str(uuid4())
        self.account_id = account_id
        self.person_id = person_id
        self.picture = picture
        self.contact_one = contact_one
        self.contact_two = contact_two
        self.state = state
        self.city = city
        self.address = address
