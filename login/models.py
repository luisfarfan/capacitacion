from __future__ import unicode_literals

from django.db import models


# Create your models here.
class User(models.Model):
    usuario = models.CharField(max_length=20)
    clave = models.CharField(max_length=200)
    nombre_completo = models.CharField(max_length=200)
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    zona = models.CharField(max_length=5)
