from flask import Blueprint, Flask
from flask_restful import Api
from flask_cors import CORS
from resources.status import Status
from resources.profile import HospitalResource
from resources.profile import DoctorResource
from resources.appointments import Appointments
from resources.listings import Listings
from resources.auth import Auth
from db import DBConnect
app = Flask(__name__)
app.config['SECRET_KEY'] = 'ecafa3ebb8276627398b03c66ed15748'
config = app.config
list_bp = Blueprint('listings', __name__)
profile_bp = Blueprint('profile', __name__)
listing_api = Api(list_bp)
profile_api = Api(profile_bp)
api = Api(app)
CORS(app, resources={r'/*': {"origins": "*"}})


api.add_resource(Status, "/status")
listing_api.add_resource(Listings, "/<string:entity>")
api.add_resource(Appointments, "/appointments")
api.add_resource(Auth, '/auth/login')
profile_api.add_resource(DoctorResource, "/doctors")
profile_api.add_resource(HospitalResource, "/hospitals")

app.register_blueprint(list_bp, url_prefix='/listings')
app.register_blueprint(profile_bp, url_prefix='/profile')


@app.teardown_appcontext
def teardown_ops(exception):
    DBConnect.close()


if __name__ == "__main__":
    app.run(debug=True, port=6500)
