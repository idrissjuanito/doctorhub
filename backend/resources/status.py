"""
api status enpoint
"""
from flask_restful import Resource, request

class Status(Resource):
    """
    sends a response for get request to indicate
    good comminucation between front and backend
    """
    def get(self):
        return {"status": "okay"}
