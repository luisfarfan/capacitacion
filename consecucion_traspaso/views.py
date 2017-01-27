from django.shortcuts import render
from consecucion_traspaso.models import *
from capacitacion.models import *


# Create your views here.

def traer_consecucion():
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').values('id_per', 'dni', 'ape_materno',
                                                                               'nombre',
                                                                               'id_cargofuncional', 'ubigeo',
                                                                               'zona', 'contingencia')
    for p in pea_consecucion:
        if p['id_cargofuncional'] == 51:
            pea = PEA(id_per=p['id_per'], dni=p['dni'], ape_paterno=p['ape_paterno'], ape_materno=p['ape_materno'],
                      nombre=p['nombre'],
                      id_cargofuncional=904, ubigeo_id=p['ubigeo'], zona=p['zona'], contingencia=p['contingencia'])
            pea.save()
