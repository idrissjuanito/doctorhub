from uuid import uuid4
from models.account import Account
from db.dbmanager import DBManager, relationship
from models.profile import Profile


class Hospital(DBManager):
    _tablename = 'hospital'
    hospital_id = 'uuid PRIMARY KEY'
    profile_id = relationship(Profile, 'profile_id')
    account_id = relationship(Account, 'account_id')
    name = 'varchar(100) NOT NULL'
    reg_number = 'varchar(50) NOT NULL'

    def __init__(self,
                 name: str,
                 profile_id: str,
                 reg_number=''):
        self.hospital_id = str(uuid4())
        self.profile_id = profile_id
        self.name = name
        self.reg_number = reg_number
