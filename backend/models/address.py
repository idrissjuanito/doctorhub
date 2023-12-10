from uuid import uuid4
from db.dbmanager import DBManager


class Address(DBManager):
    _tablename = 'address'
    address_id = 'uuid PRIMARY KEY'
    state = 'varchar(30) NOT NULL'
    city = 'varchar(30) NOT NULL'
    address = 'varchar(30) NOT NULL'
    address_2 = 'varchar(30)'

    def __init__(self, state: str, city: str, address: str, addr_2=''):
        self.address_id = str(uuid4())
        self.state = state
        self.city = city
        self.address = address
        self.address_2 = addr_2
