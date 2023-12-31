from models.account import Account
from models.profile import Profile
from db.dbmanager import DBManager, relationship
from uuid import uuid4

class Person(DBManager):
    _tablename = 'person'
    person_id = 'uuid PRIMARY KEY'
    first_name = 'varchar(50) NOT NULL'
    last_name = 'varchar(50) NOT NULL'
    gender = 'varchar(10) NOT NULL'

    def __init__(self,
                 first_name: str,
                 last_name: str,
                 gender: str):
        self.person_id = str(uuid4())
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
