import firebase_admin
from firebase_admin import credentials, storage
from flask_restful import abort

cred = credentials.Certificate("/Users/admin/Workspace/alxwork/doctorhub/backend/firebaseservice.json")
app = firebase_admin.initialize_app(cred, {
        "storageBucket": "doctohub-32c6e.appspot.com"
    })

def upload_image(filename, file_path):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(filename)
        result = blob.upload_from_filename(file_path)
        image_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{filename}?alt=media"
        return image_url
    except Exception as e:
        print(e)
        abort(500, message="file upload failed")
