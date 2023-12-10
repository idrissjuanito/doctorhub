from db.dbmanager import DBManager
from uuid import uuid4


class Person(DBManager):
    _tablename = 'person'
    person_id = 'uuid PRIMARY KEY'
    first_name = 'varchar(50) NOT NULL'
    last_name = 'varchar(50) NOT NULL'
    gender = 'varchar(10) NOT NULL'
    _person_id = ''

    def __init__(self,
                 first: str,
                 last: str,
                 gender: str):
        Person._person_id = str(uuid4())
        Person.insert_record({
            'person_id': Person._person_id,
            'first_name': first,
            'last_name': last,
            'gender': gender
        })
