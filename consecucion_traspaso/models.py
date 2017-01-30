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
    id_convocatoriacargo = models.IntegerField()
    zona = models.CharField(max_length=5, blank=True, null=True)
    contingencia = models.IntegerField(blank=True, null=True)
    ubigeo = models.CharField(max_length=6)

    class Meta:
        managed = False
        db_table = 'v_personal_capacitacion'


class MetaSeleccion(models.Model):
    ccdd = models.CharField(max_length=2, blank=True, null=True)
    ccpp = models.CharField(max_length=2, blank=True, null=True)
    ccdi = models.CharField(max_length=2, blank=True, null=True)
    ubigeo = models.CharField(max_length=6, blank=True, null=True)
    id_convocatoriacargo = models.IntegerField()
    id_cargofuncional = models.IntegerField()
    meta = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'meta_seleccion'


# bandaprob
# 3 = ALTA
# 4 = BAJA
class Ficha177(models.Model):
    id_per = models.IntegerField(primary_key=True)
    id_convocatoriacargo = models.IntegerField()
    capacita = models.IntegerField()
    notacap = models.FloatField()
    seleccionado = models.IntegerField()
    sw_titu = models.IntegerField()
    bandaprob = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ficha_177'
