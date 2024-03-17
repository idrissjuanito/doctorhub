from uuid import uuid4
from db.dbmanager import DBManager, relationship
from models.profile import Profile


class Hospital(DBManager):
    _tablename = 'hospital'
    hospital_id = 'uuid PRIMARY KEY'
    profile_id = relationship(Profile, 'CASCADE')
    name = 'varchar(100) NOT NULL'
    reg_number = 'varchar(50) NOT NULL'

    def __init__(self,
                 name: str,
                 reg_number=None):
        self.hospital_id = str(uuid4())
        self.name = name
        self.reg_number = reg_number
        self.profile_id = None
