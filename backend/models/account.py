from uuid import uuid4
from db.dbmanager import DBManager


class Account(DBManager):
    '''
    class defines account object for users
    '''
    _tablename = 'account'
    account_id = 'uuid PRIMARY KEY'
    email = 'varchar(100) NOT NULL'
    password = 'varchar(150) NOT NULL'
    acc_type = 'varchar(20)'

    def __init__(self,
                 email: str,
                 password: str,
                 acc_type='patient'):
        self.account_id = str(uuid4())
        self.email = email
        self.password = password
        self.acc_type = acc_type
