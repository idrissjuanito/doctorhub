from flask import Blueprint, Flask
from flask_restful import Api
from resources.appointments import Appointments
from resources.listings import Listings
from resources.auth import Auth
from db import DBConnect
app = Flask(__name__)
list_bp = Blueprint('listings', __name__)
listing_api = Api(list_bp)
api = Api(app)


listing_api.add_resource(Listings, "/<string:entity>")
api.add_resource(Appointments, "/appointments")
api.add_resource(Auth, "/login")
app.register_blueprint(list_bp, url_prefix='/listings')


@app.teardown_appcontext
def teardown_ops(exception):
    DBConnect.close()


if __name__ == "__main__":
    app.run(debug=True)
