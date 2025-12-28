from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb+srv://manojkumarscs25_db_user:ManojKumar2007@cluster0.mtrxsz8.mongodb.net/?appName=Cluster0")

# Database name
db = client["student"]

# Collection name
collection = db["records"]