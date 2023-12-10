from uuid import uuid4
from db.dbmanager import DBManager, relationship
from models.address import Address


class Profile(DBManager):
    _tablename = 'profile'
    profile_id = 'uuid PRIMARY KEY'
    username = 'varchar(25)'
    password = 'varchar(25) NOT NULL'
    acc_email = 'varchar(50) UNIQUE NOT NULL'
    contact = 'varchar(15)'
    profile_pic = 'varchar(100)'
    address_id = relationship(Address, 'address_id')

    def __init__(self,
                 email,
                 contact='',
                 usern='',
                 passw='password',
                 profile=''):
        self.profile_id = str(uuid4())
        self.username = usern
        self.password = passw
        self.acc_email = email
        self.profile_pic = profile
        self.contact = contact
