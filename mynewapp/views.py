from base64 import b64encode
from datetime import timedelta
import json
from django.utils import timezone
import os
import uuid
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from mynewapp.models import EncryptedFile, SharableLink
from .authentication import RequestToken, authorized, can
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from authlib.integrations.django_oauth2 import ResourceProtector
from . import validator

require_auth = ResourceProtector()
validator = validator.Auth0JWTBearerTokenValidator(
    "dev-u3pvqte1l7ripqyb.us.auth0.com",
    "http://127.0.0.1:8000/"
)
require_auth.register_token_validator(validator)


# Create your views here.


# @api_view(['GET'])
@require_auth("fetch:token")
def my_view(request: HttpRequest) -> JsonResponse:
    return JsonResponse({'message': 'Hello, world!,'})


@require_auth("fetch:token")
def generate_aes_key(request):
    key = os.urandom(32)  # Generate a random 256-bit key
    return JsonResponse({'key': b64encode(key).decode('utf-8')})


@require_auth("fetch:token")
def upload_file(request):
    key_hex = request.POST.get('key')
    iv_hex = request.POST.get('iv')
    type = request.POST.get('fileType')
    size= request.POST.get('size')
    encrypted_file = request.FILES['file']

    key = bytes.fromhex(key_hex)
    iv = bytes.fromhex(iv_hex)

    encrypted_data = encrypted_file.read()
    tag = encrypted_data[-16:]  # Extract the last 16 bytes as the authentication tag
    ciphertext = encrypted_data[:-16]  # The rest is the ciphertext

    cipher = Cipher(algorithms.AES(key), modes.GCM(iv, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    data = decryptor.update(ciphertext) + decryptor.finalize()
    try:
        encrypted_file_instance = EncryptedFile.objects.create(
            name=encrypted_file.name,
            iv=iv,
            size=size,
            tag=tag,
            key=key,
            encrypted_data=ciphertext,
            type=type
        )
        return JsonResponse({
            'status': 'success',
            'name': encrypted_file_instance.name,
            'iv': b64encode(encrypted_file_instance.iv).decode('utf-8'),
            'size': encrypted_file_instance.size,
            'tag': b64encode(encrypted_file_instance.tag).decode('utf-8'),
            'uploaded_at': encrypted_file_instance.uploaded_at,
        })
    except IntegrityError:
            return JsonResponse({'status': 'error', 'message': 'A file with this name already exists'}, status=400)

@require_auth("fetch:token")
def generate_sharable_token(request):
    filename = request.POST.get('filename')
    user_ids = json.loads(request.POST.get('userId', '[]'))  # Get the array of user IDs from the request
    link_type = request.POST.get('linkType')
    file = get_object_or_404(EncryptedFile, name=filename)
    token = uuid.uuid4()
    expiration = timezone.now() + timedelta(days=5)
    sharable_link_instance = SharableLink.objects.create(
        file=file,
        token=token,
        expiration=expiration,
        user_ids=user_ids,
        link_type=link_type
    )
    return JsonResponse({'token': str(sharable_link_instance.token)})

@require_auth(None)
def fetch_encrypted_files(request):
    files = EncryptedFile.objects.all()
    files_data = [
        {
            'name': file.name,
            'tag': b64encode(file.tag).decode('utf-8'),
            'size': file.size,
            'uploaded_at': file.uploaded_at
        }
        for file in files
    ]
    return JsonResponse({'files': files_data})

@require_auth(None)
def fetch_file_by_token(request):
    token = request.POST.get('token')
    userId = request.POST.get('userId')
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=400)
    
    sharable_link = get_object_or_404(SharableLink, token=token)
    if userId not in sharable_link.user_ids:
        return JsonResponse({'error': 'User ID not authorized'}, status=403)
    if timezone.now() > sharable_link.expiration:
        return JsonResponse({'error': 'Token has expired'}, status=403)
    file = sharable_link.file
    file_data = {
        'name': file.name,
        'iv': b64encode(file.iv).decode('utf-8'),
        'tag': b64encode(file.tag).decode('utf-8'),
        'encrypted_data': b64encode(file.encrypted_data).decode('utf-8'),
        'uploaded_at': file.uploaded_at,
        'key': b64encode(file.key).decode('utf-8'),
        'type': file.type,
        'linkType': sharable_link.link_type
    }
    return JsonResponse(file_data)

@require_auth(None)
def fetch_encrypted_file(request, name):
    file = get_object_or_404(EncryptedFile, name=name)
    file_data = {
        'name': file.name,
        'iv': b64encode(file.iv).decode('utf-8'),
        'tag': b64encode(file.tag).decode('utf-8'),
        'encrypted_data': b64encode(file.encrypted_data).decode('utf-8'),
        'uploaded_at': file.uploaded_at,
        'key': b64encode(file.key).decode('utf-8'),
        'type': file.type
    }
    return JsonResponse(file_data)