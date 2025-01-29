# filepath: /Users/abhinavjain/Zephyra/zephyra_backend/mynewapp/urls.py
from django.urls import path
from .views import fetch_encrypted_file, fetch_encrypted_files, fetch_file_by_token,  generate_aes_key, generate_sharable_token, my_view, upload_file

urlpatterns = [
    path('my-endpoint/', my_view, name='my-endpoint'),
    path('generate-aes-key/', generate_aes_key, name='generate-aes-key'),
    path('upload/', upload_file, name='upload_file'),
    path('files/', fetch_encrypted_files, name='fetch_encrypted_files'),
    path('files/<str:name>/', fetch_encrypted_file, name='fetch_encrypted_file'),
    path('generate-sharable-token/', generate_sharable_token, name='generate_sharable_token'),
    path('file-details-token/', fetch_file_by_token, name='fetch_file_by_token'),

]   