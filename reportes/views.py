from capacitacion.models import *
from django.db.models import Count, Value
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
import inspect


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


def ApiAulasCoberturadasPorCurso(request, ubigeo, id_curso):
    query = list(Local.objects.annotate(
        dcount=Count('ambientes__localambiente__id_localambiente')).values('dcount').filter(ubigeo=ubigeo,
                                                                                            id_curso=id_curso))
    absoluto = 0
    for i in query:
        absoluto = absoluto + int(i['dcount'])

    meta = list(UbigeoCursoMeta.objects.filter(ubigeo=ubigeo, curso=id_curso))
    meta_cantidad = 0
    if meta:
        meta_cantidad = meta[0].cantidad

    return JsonResponse({'absoluto': absoluto, 'meta': meta_cantidad})


def TotalPostulantesSeleccionados(request):
    query = PEA.objects.values('id_cargofuncional__id_curso', 'id_cargofuncional__id_curso__nombre_curso').annotate(
        dcount=Count('id_pea'))


def TotalPostulantesQueAsistieron(request):
    query = PEA.objects.values('id_cargofuncional__id_curso', 'id_cargofuncional__id_curso__nombre_curso').annotate(
        dcount=Count('id_pea'))


def directorio_locales(request):
    template = loader.get_template('capacitacion/modulo_registro.html')
    funcionarios = FuncionariosINEI.objects.values('id_per', 'ape_paterno', 'ape_materno',
                                                   'nombre', 'dni')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'REGISTRO DE LOCAL',
        'funcionarios': funcionarios,
    }
    return HttpResponse(template.render(context, request))
