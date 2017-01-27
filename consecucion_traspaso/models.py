from __future__ import unicode_literals

from django.db import models

# Create your models here.
class PersonalCapacitacion(models.Model):
    id_per = models.IntegerField(primary_key=True)
    dni = models.CharField(max_length=8, blank=True, null=True)
    ape_paterno = models.CharField(max_length=100, blank=True, null=True, db_column='ape_paterno')
    ape_materno = models.CharField(max_length=100, blank=True, null=True, db_column='ape_materno')
    nombre = models.CharField(max_length=100, blank=True, null=True, db_column='nombre')
    id_cargofuncional = models.IntegerField()
    id_convocatoria_cargo = models.IntegerField()
    zona = models.CharField(max_length=5, blank=True, null=True)
    contingencia = models.IntegerField(blank=True, null=True)
    ubigeo = models.CharField(max_length=6)
    correo = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=100, blank=True, null=True)
    celular = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_personal_capacitacion'