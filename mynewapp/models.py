import uuid
from django.db import models

#
class MyModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
class EncryptedFile(models.Model):
    name = models.CharField(max_length=255, unique=True)
    size= models.IntegerField(default=0)
    iv = models.BinaryField()
    tag = models.BinaryField()
    encrypted_data = models.BinaryField()
    key= models.BinaryField(default=b'')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=255, default='text/')
    
    def __str__(self):
        return self.name
    
class SharableLink(models.Model):
    file = models.ForeignKey(EncryptedFile, to_field='name', on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expiration = models.DateTimeField()
    link_type = models.CharField(max_length=255, default='view')
    user_ids = models.JSONField(default=list)  # Add this line to store array of user IDs

    def __str__(self):
        return self.file.name