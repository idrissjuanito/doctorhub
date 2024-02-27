from uuid import uuid4
from db.dbmanager import relationship
from db.dbmanager import DBManager


class Account(DBManager):
    '''
    class defines account object for users
    '''
    _tablename = 'account'
    account_id = 'uuid PRIMARY KEY'
    email = 'varchar(100) NOT NULL'
    password = 'varchar(150) NOT NULL'
    account_type = 'varchar(20) NOT NULL'
    verified = 'boolean DEFAULT false'

    def __init__(self,
                 email: str,
                 password: str,
                 account_type='patient'):
        self.account_id = str(uuid4())
        self.email = email
        self.password = password
        self.account_type = account_type
        self.verified = False
