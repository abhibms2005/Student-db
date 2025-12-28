from django.urls import path
from .views import records

urlpatterns = [
    path("records/", records),
]
