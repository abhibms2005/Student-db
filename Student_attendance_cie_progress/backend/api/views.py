from rest_framework.decorators import api_view
from rest_framework.response import Response
from .db import collection

@api_view(['GET', 'POST'])
def records(request):
    if request.method == 'GET':
        data = list(collection.find({}, {"_id": 0}))  # Return all students
        return Response(data)
    elif request.method == 'POST':
        collection.insert_one(request.data)  # Save student data
        return Response({"message": "Record added"})
