from flask import Blueprint, Flask
from flask_restful import Api
from resources.register import DoctorResource
from resources.appointments import Appointments
from resources.listings import Listings
from resources.auth import Auth
from db import DBConnect
app = Flask(__name__)
list_bp = Blueprint('listings', __name__)
account_bp = Blueprint('account', __name__)
listing_api = Api(list_bp)
account_api = Api(account_bp)
api = Api(app)


listing_api.add_resource(Listings, "/<string:entity>")
api.add_resource(Appointments, "/appointments")
account_api.add_resource(DoctorResource, "/doctors")
app.register_blueprint(list_bp, url_prefix='/listings')
app.register_blueprint(account_bp, url_prefix='/profile')


@app.teardown_appcontext
def teardown_ops(exception):
    DBConnect.close()


if __name__ == "__main__":
    app.run(debug=True)
