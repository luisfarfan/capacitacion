from django.shortcuts import render
from consecucion_traspaso.models import *
from capacitacion.models import *
from login.models import *
from django.http import JsonResponse, HttpResponse
from django.db.models import F, Case, Value, When, IntegerField


# Create your views here.

def traer_consecucion(request):
    # pea_consecucion = PersonalCapacitacion.objects.using('consecucion').filter(id_cargofuncional=51)
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').all()
    for p in pea_consecucion:
        cargofuncional = Funcionario.objects.get(id_cargofuncional=p.id_cargofuncional)
        id_cargofuncional = cargofuncional.id_funcionario
        pea_exist = PEA.objects.filter(id_per=p.id_per, id_convocatoriacargo=p.id_convocatoriacargo,
                                       id_cargofuncional=id_cargofuncional)
        if pea_exist.count() == 0:
            pea = PEA(id_per=p.id_per, dni=p.dni, ape_paterno=p.ape_paterno, ape_materno=p.ape_materno, is_grupo=6,
                      nombre=p.nombre, id_cargofuncional_id=id_cargofuncional, ubigeo_id=p.ubigeo, zona=p.zona,
                      contingencia=p.contingencia, id_convocatoriacargo=p.id_convocatoriacargo)
            pea.save()

    pea = PEA.objects.all().values()
    return JsonResponse(list(pea), safe=False)


def traer_consecucion_curso3_grupo2(request):
    # pea_consecucion = PersonalCapacitacion.objects.using('consecucion').filter(id_cargofuncional=51)
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').all()
    pea1 = PEA.objects.all().count()
    for p in pea_consecucion:
        pea = PEA(id_per=p.id_per, dni=p.dni, ape_paterno=p.ape_paterno, ape_materno=p.ape_materno,
                  nombre=p.nombre,
                  id_cargofuncional_id=165, ubigeo_id=p.ubigeo, zona=p.zona, contingencia=p.contingencia,
                  id_convocatoriacargo=p.id_convocatoriacargo, is_grupo=1)
        pea.save()
    pea2 = PEA.objects.all().count()
    # pea_borrar = PEA.objects.filter(id_cargofuncional=904).delete()
    return JsonResponse({'cant1': pea1.count(), 'cant2': pea2}, safe=False)


def update_consecucion(request):
    pea_consecucion = PersonalCapacitacion.objects.using('consecucion').filter(id_cargofuncional=51)
    for p in pea_consecucion:
        pea_capa = PEA.objects.filter(id_per=p.id_per)
        if pea_capa.count() > 0:
            pea_capa.update(ape_materno=p.ape_materno, ape_paterno=p.ape_paterno)

    # pea_borrar = PEA.objects.filter(id_cargofuncional=904).delete()
    pea = PEA.objects.all().values()
    return JsonResponse(list(pea), safe=False)


def getMetaConsecucion(request, ubigeo, curso):
    cargos = CursoFuncionario.objects.filter(id_curso=curso).values_list('id_funcionario', flat=True)
    if curso == "2":
        meta = MetaSeleccion.objects.using('consecucion').get(ubigeo=ubigeo, id_cargofuncional=51)
    elif curso == "3":
        meta = MetaSeleccion.objects.using('consecucion').get(ubigeo=ubigeo, id_cargofuncional=548)
    elif curso == "13":
        return JsonResponse({'meta': 9})
    elif curso == "4":
        meta = MetaSeleccion.objects.using('consecucion').get(ubigeo=ubigeo, id_cargofuncional=547)
    elif curso == "5":
        meta = MetaSeleccion.objects.using('consecucion').get(ubigeo=ubigeo, id_cargofuncional=550)
    return JsonResponse({'meta': meta.meta})


def cerrarCurso(request, id_usuario):
    usuario = User.objects.get(pk=id_usuario)
    usuario.cierre = 1
    usuario.save()

    User.objects.filter(ccdd=usuario.ccdd, ccpp=usuario.ccpp, ccdi=usuario.ccdi, curso=usuario.curso).update(cierre=1)
    # cargos = CursoFuncionario.objects.filter(id_curso=curso).values_list('id_funcionario', flat=True)
    meta_cantidad = 0
    pea_return = []
    if usuario.curso_id == 5:
        meta = MetaSeleccion.objects.using('consecucion').get(ccdd=usuario.ccdd, ccpp=usuario.ccpp, ccdi=usuario.ccdi,
                                                              id_cargofuncional=550)
        meta_cantidad = meta.meta

        pea_titular = PEA.objects.filter(id_cargofuncional=284, ubigeo=meta.ubigeo, baja_estado=0,
                                         peanotafinal__nota_final__gte=11, is_grupo=5).annotate(
            nota_final=F('peanotafinal__nota_final'), capacita=F('peanotafinal__aprobado'),
            seleccionado=F('peanotafinal__aprobado'), sw_titu=Value(1, IntegerField()), bandaprob=Case(
                When(alta_estado=1, then=Value(3)),
                default=Value(1),
                output_field=IntegerField()
            )).values('id_per',
                      'id_convocatoriacargo',
                      'nota_final', 'capacita',
                      'seleccionado',
                      'sw_titu', 'bandaprob', 'id_pea').order_by(
            '-nota_final')[:meta_cantidad]
        pea_titular_ids = []
        for pt in pea_titular:
            pea_titular_ids.append(pt['id_pea'])
            ficha177 = Ficha177.objects.using('consecucion').get(id_per=pt['id_per'])
            ficha177.bandaprob = pt['bandaprob']
            ficha177.sw_titu = pt['sw_titu']
            ficha177.seleccionado = pt['seleccionado']
            ficha177.notacap = pt['nota_final']
            ficha177.capacita = pt['capacita']
            ficha177.save()

        pea_reserva = PEA.objects.exclude(id_pea__in=pea_titular_ids).filter(id_cargofuncional=284,
                                                                             ubigeo=meta.ubigeo, is_grupo=5).annotate(
            nota_final=F('peanotafinal__nota_final'), capacita=F('peanotafinal__aprobado'),
            seleccionado=F('peanotafinal__aprobado'), sw_titu=Value(0, IntegerField()), bandaprob=Case(
                When(baja_estado=1, then=Value(4)),
                When(alta_estado=1, then=Value(3)),
                default=Value(1),
                output_field=IntegerField()
            )).values('id_per',
                      'id_convocatoriacargo',
                      'nota_final', 'capacita',
                      'seleccionado',
                      'sw_titu', 'bandaprob', 'id_pea').order_by(
            '-nota_final')

        for pt in pea_reserva:
            pea_titular_ids.append(pt['id_pea'])
            ficha177 = Ficha177.objects.using('consecucion').get(id_per=pt['id_per'])
            ficha177.bandaprob = pt['bandaprob']
            ficha177.sw_titu = pt['sw_titu']
            ficha177.seleccionado = pt['seleccionado']
            ficha177.notacap = pt['nota_final']
            ficha177.capacita = pt['capacita']
            ficha177.save()

            # pea_return = pea_titular | pea_reserva

    return JsonResponse({'titulares': list(pea_titular), 'reserva': list(pea_reserva)}, safe=False)
