from django.shortcuts import render
from consecucion_traspaso.models import *
from capacitacion.models import *
from django.http import JsonResponse, HttpResponse


# Create your views here.

def traer_consecucion(request):
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').filter(id_cargofuncional=51)
    for p in pea_consecucion:
        pea_capa = PEA.objects.filter(id_per=p.id_per)
        if pea_capa.count() == 0:
            if p.id_cargofuncional == 51:
                pea = PEA(id_per=p.id_per, dni=p.dni, ape_paterno=p.ape_paterno, ape_materno=p.ape_materno,
                          nombre=p.nombre,
                          id_cargofuncional_id=904, ubigeo_id=p.ubigeo, zona=p.zona, contingencia=p.contingencia,
                          id_convocatoriacargo=p.id_convocatoriacargo)
                pea.save()

    # pea_borrar = PEA.objects.filter(id_cargofuncional=904).delete()
    pea = PEA.objects.all().values()
    return JsonResponse(list(pea), safe=False)


def update_consecucion(request):
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').filter(id_cargofuncional=51)
    for p in pea_consecucion:
        pea_capa = PEA.objects.filter(id_per=p.id_per)
        if pea_capa.count() > 0:
            pea_capa.update(ape_materno=p.ape_materno, ape_paterno=p.ape_paterno)

    # pea_borrar = PEA.objects.filter(id_cargofuncional=904).delete()
    pea = PEA.objects.all().values()
    return JsonResponse(list(pea), safe=False)
