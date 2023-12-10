from flask_restful import Resource
from models.doctor import Doctor
from models.hospital import Hospital
from models.address import Address
from models.contact import Contact
from models.person import Person


class Home(Resource):
    def get(self):
        #         "INNER", "accounts", "accounts.account_id = people.account_id")
        # print(Person.fetch(2))
        return "Hello Doctor hub"
