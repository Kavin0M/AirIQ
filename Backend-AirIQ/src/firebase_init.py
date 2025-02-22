import firebase_admin
from firebase_admin import credentials, db

# Load Firebase credentials (Download from Firebase Console)
cred = credentials.Certificate("/Users/sabarinarayana/Developer/AirIQ/firebase-adminsdk-fbsvc.json")

# Initialize Firebase app only if it's not already initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://airiq-7c670-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

# Function to get database reference
def get_db_ref(path="/"):
    return db.reference(path)