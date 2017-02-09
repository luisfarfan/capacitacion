from capacitacion.models import *
from django.db.models import Count, Value, F, Sum
from django.http import JsonResponse
from login.models import Menu
from consecucion_traspaso.models import MetaSeleccion


# Create your views here.

def ApiDirectorioLocales(request, ccdd=None, ccpp=None, ccdi=None, zona=None):
    query = Local.objects.annotate(dcount=Count('localambiente__id_ambiente__localambiente')).values(
        'ubigeo__departamento', 'ubigeo__provincia', 'ubigeo__distrito', 'id_curso__nombre_curso', 'nombre_local',
        'tipo_via', 'nombre_via', 'n_direccion', 'piso_direccion', 'mz_direccion', 'lote_direccion', 'km_direccion',
        'responsable_nombre', 'responsable_telefono', 'dcount')
    return_query = []
    if zona is not None:
        return_query = query.filter(ubigeo__ccdd=ccdd, ubigeo__ccpp=ccpp, ubigeo__ccdi=ccdi, zona=zona)
    elif ccdi is not None and zona is None:
        return_query = query.filter(ubigeo__ccdd=ccdd, ubigeo__ccpp=ccpp, ubigeo__ccdi=ccdi)
    elif ccpp is not None and ccdi is None:
        return_query = query.filter(ubigeo__ccdd=ccdd, ubigeo__ccpp=ccpp)
    elif ccdd is not None and ccpp is None:
        return_query = query.filter(ubigeo__ccdd=ccdd)

    return JsonResponse(list(return_query), safe=False)


def RelacionLocales(request):
    query = Local.objects.values('id_curso', 'id_curso__nombre_curso')


def ApiAulasCoberturadasPorCurso(request, id_curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
    query = Local.objects.annotate(
        dcount=Count('ambientes__localambiente__id_localambiente'))

    cargos = CursoFuncionario.objects.filter(id_curso=id_curso).values_list('id_funcionario__id_cargofuncional',
                                                                            flat=True)
    if ccdi is not None:
        query_filter = query.values('dcount', 'ubigeo__ccdd', 'ubigeo__departamento', 'ubigeo__ccpp').filter(
            id_curso=id_curso, ubigeo__ccdd=ccdd, ubigeo__ccpp=ccpp, ubigeo__ccdi=ccdi)
    elif ccpp is not None and ccdi is None:
        query_filter = query.values('dcount', 'ubigeo__ccdd', 'ubigeo__departamento', 'ubigeo__ccpp', 'ubigeo__ccdi',
                                    'ubigeo__distrito').filter(id_curso=id_curso, ubigeo__ccdd=ccdd, ubigeo__ccpp=ccpp)
    elif ccdd is not None and ccpp is None:
        query_filter = query.values('dcount', 'ubigeo__ccdd', 'ubigeo__departamento', 'ubigeo__ccpp').filter(
            id_curso=id_curso, ubigeo__ccdd=ccdd)
    elif ccdd is None:
        query_filter = query.values('dcount', 'ubigeo__ccdd', 'ubigeo__departamento').filter(id_curso=id_curso)

    return JsonResponse(list(query_filter), safe=False)


def TotalPostulantesSeleccionados(request):
    query = PEA.objects.values('id_cargofuncional__id_curso', 'id_cargofuncional__id_curso__nombre_curso').annotate(
        dcount=Count('id_pea'))


# Reporte 4
def PersonalQueSeDioDeBajaPorCurso(request, ccdd, ccpp, ccdi, zona):
    curso = Curso.objects.all().filter(id_etapa=1)
    response = []
    ubigeo = ccdd + ccpp + ccdi
    for c in curso:
        curso_funcionario = CursoFuncionario.objects.filter(id_curso=c.id_curso).values_list('id_funcionario',
                                                                                             flat=True)
        pea_baja_curso = PEA.objects.filter(baja_estado=1, id_cargofuncional__in=curso_funcionario, ubigeo=ubigeo,
                                            zona=zona).count()
        response.append(
            {'id_curso': c.id_curso, 'nombre_curso': c.nombre_curso, 'cantidad_pea_baja': pea_baja_curso})

    return JsonResponse(response, safe=False)


# Reporte 5
def PersonalQueSeDioDeAltaPorCurso(request, ccdd, ccpp, ccdi, zona):
    curso = Curso.objects.all()
    response = []
    ubigeo = ccdd + ccpp + ccdi
    for c in curso:
        curso_funcionario = CursoFuncionario.objects.filter(id_curso=c.id_curso).values_list('id_funcionario',
                                                                                             flat=True)
        pea_baja_curso = PEA.objects.filter(alta_estado=1, id_cargofuncional__in=curso_funcionario, ubigeo=ubigeo,
                                            zona=zona).count()
        response.append(
            {'id_curso': c.id_curso, 'nombre_curso': c.nombre_curso, 'cantidad_pea_alta': pea_baja_curso})

    return JsonResponse(response, safe=False)


# Reporte 6,7,8,9
def AprobadosPorCargo(request, ubigeo, cargo):
    query = PeaNotaFinal.objects.filter(id_pea__ubigeo=ubigeo, id_pea__id_cargofuncional=cargo).annotate(
        departamento=F('id_pea__ubigeo__departamento'), provincia=F('id_pea__ubigeo__provincia'),
        distrito=F('id_pea__ubigeo__distrito'), cargo=F('id_pea__id_cargofuncional__nombre_funcionario')).values(
        'departamento', 'provincia', 'distrito', 'id_pea__ape_paterno',
        'id_pea__ape_materno', 'id_pea__nombre', 'cargo', 'nota_final', 'id_pea__dni')
    return JsonResponse(list(query), safe=False)


def AprobadosPorUbigeoCurso(request, ubigeo, zona, curso):
    cargos = CursoFuncionario.objects.filter(id_curso=curso).values_list('id_funcionario', flat=True)

    if zona == '00':
        if curso == "1":
            query = PeaNotaFinal.objects.filter(id_pea__dni__in=['25709168', '10172799', '08158910'])
        elif curso == "5":
            query = PeaNotaFinal.objects.filter(id_pea__ubigeo=ubigeo, id_pea__id_cargofuncional__in=[284],
                                                id_pea__is_grupo=5)
        else:
            query = PeaNotaFinal.objects.filter(id_pea__ubigeo=ubigeo, id_pea__id_cargofuncional__in=cargos)
    else:
        query = PeaNotaFinal.objects.filter(id_pea__ubigeo=ubigeo, id_pea__id_cargofuncional__in=cargos,
                                            id_pea__zona=zona)
    query_return = query.annotate(
        departamento=F('id_pea__ubigeo__departamento'), provincia=F('id_pea__ubigeo__provincia'),
        distrito=F('id_pea__ubigeo__distrito'), cargo=F('id_pea__id_cargofuncional__nombre_funcionario'),
        zona=F('id_pea__zona')).values('id',
                                       'departamento', 'provincia', 'distrito', 'id_pea__ape_paterno',
                                       'id_pea__ape_materno', 'id_pea__nombre', 'cargo', 'nota_final',
                                       'id_pea__dni',
                                       'zona', 'aprobado', 'seleccionado').order_by('-nota_final')

    return JsonResponse(list(query_return), safe=False)


def getReportesList(request):
    reportes_list = Menu.objects.all().values()
    return JsonResponse(list(reportes_list), safe=False)
