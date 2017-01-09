from rest_framework.views import APIView
from django.db.models import Count, Value
from django.http import JsonResponse
from django.http import HttpResponse
from django.template import loader
from serializer import *
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, Sum
from datetime import datetime
import pandas as pd
from django.db.models.functions import Concat
from django.core.exceptions import ObjectDoesNotExist

import json
from random import sample


def modulo_registro(request):
    template = loader.get_template('capacitacion/modulo_registro.html')
    funcionarios = FuncionariosINEI.objects.values('id_per', 'ape_paterno', 'ape_materno',
                                                   'nombre', 'dni')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'REGISTRO DE LOCAL',
        'funcionarios': funcionarios,
    }
    return HttpResponse(template.render(context, request))


def cursos_evaluaciones(request):
    template = loader.get_template('capacitacion/cursos_evaluaciones.html')

    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Cursos y Evaluaciones',
    }
    return HttpResponse(template.render(context, request))


def asistencia(request):
    template = loader.get_template('capacitacion/asistencia.html')
    instructores = Instructor.objects.all()
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Modulo de Asistencia',
        'instructores': instructores
    }
    return HttpResponse(template.render(context, request))


def distribucion(request):
    template = loader.get_template('capacitacion/distribucion.html')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Modulo de Distribucion'
    }
    return HttpResponse(template.render(context, request))


def evaluacion(request):
    template = loader.get_template('capacitacion/evaluacion.html')

    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Modulo de Evaluacion',

    }
    return HttpResponse(template.render(context, request))


# Create your views here.

class DepartamentosList(APIView):
    def get(self, request):
        departamentos = list(
            Ubigeo.objects.values('ccdd', 'departamento').annotate(dcount=Count('ccdd', 'departamento')))
        response = JsonResponse(departamentos, safe=False)
        return response


class ProvinciasList(APIView):
    def get(self, request, ccdd):
        provincias = list(
            Ubigeo.objects.filter(ccdd=ccdd).values('ccpp', 'provincia').annotate(dcount=Count('ccpp', 'provincia')))
        response = JsonResponse(provincias, safe=False)
        return response


class DistritosList(APIView):
    def get(self, request, ccdd, ccpp):
        distritos = list(Ubigeo.objects.filter(ccdd=ccdd, ccpp=ccpp).values('ccdi', 'distrito').annotate(
            dcount=Count('ccdi', 'distrito')))
        response = JsonResponse(distritos, safe=False)
        return response


class ZonasList(APIView):
    def get(self, request, ubigeo):
        zonas = list(
            Zona.objects.filter(UBIGEO=ubigeo).values('UBIGEO', 'ZONA', 'ETIQ_ZONA').annotate(
                dcount=Count('UBIGEO', 'ZONA')))
        response = JsonResponse(zonas, safe=False)
        return response


class TbLocalByUbigeoViewSet(generics.ListAPIView):
    serializer_class = LocalSerializer

    def get_queryset(self):
        ubigeo = self.kwargs['ubigeo']
        id_curso = self.kwargs['id_curso']
        return Local.objects.filter(ubigeo=ubigeo, id_curso=id_curso)


class TbLocalByZonaViewSet(generics.ListAPIView):
    serializer_class = LocalSerializer

    def get_queryset(self):
        ubigeo = self.kwargs['ubigeo']
        zona = self.kwargs['zona']
        id_curso = self.kwargs['id_curso']
        return Local.objects.filter(ubigeo=ubigeo, zona=zona, id_curso=id_curso)


# class TbLocalByZonaViewSet(generics.ListAPIView):
#     serializer_class = LocalAulasSerializer
#
#     def get_queryset(self):
#         ubigeo = self.kwargs['ubigeo']
#         zona = self.kwargs['zona']
#         return Local.objects.filter(ubigeo=ubigeo, zona=zona)


def TbLocalAmbienteByLocalViewSet(request, id_local):
    query = LocalAmbiente.objects.filter(id_local=id_local).order_by('-capacidad').annotate(
        nombre_ambiente=F('id_ambiente__nombre_ambiente'), cant_pea=Count('pea')).values(
        'id_localambiente', 'numero', 'capacidad', 'nombre_ambiente', 'n_piso', 'cant_pea').order_by('id_ambiente')
    local = Local.objects.get(pk=id_local)
    return JsonResponse(
        {'ambientes': list(query), 'ubigeo': local.ubigeo_id, 'zona': local.zona, 'id_curso': local.id_curso_id},
        safe=False)


class LocalAmbienteByLocalAulaViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteSerializer

    def get_queryset(self):
        id_local = self.kwargs['id_local']
        id_ambiente = self.kwargs['id_ambiente']
        return LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=id_ambiente)


class AmbienteViewSet(viewsets.ModelViewSet):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer


class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer


class LocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbiente.objects.all()
    serializer_class = LocalAmbienteSerializer


class CursobyEtapaViewSet(generics.ListAPIView):
    serializer_class = CursoSerializer

    def get_queryset(self):
        id_etapa = self.kwargs['id_etapa']
        return Curso.objects.filter(id_etapa=id_etapa)


class CriteriosViewSet(viewsets.ModelViewSet):
    queryset = Criterio.objects.all()
    serializer_class = CriterioSerializer


class CursoCriteriosViewSet(viewsets.ModelViewSet):
    queryset = CursoCriterio.objects.all()
    serializer_class = CursoCriterioSerializer


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer


class CursoCriteriobyCursoViewSet(generics.ListAPIView):
    serializer_class = CursoCriterioSerializer

    def get_queryset(self):
        id_curso = self.kwargs['id_curso']
        return CursoCriterio.objects.filter(id_curso=id_curso)


class PEA_BY_AULAViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbiente.objects.all()
    serializer_class = PEA_BY_AULASerializer


class PEA_ASISTENCIAViewSet(viewsets.ModelViewSet):
    queryset = PEA_ASISTENCIA.objects.all()
    serializer_class = PEA_ASISTENCIASerializer


class PEAViewSet(viewsets.ModelViewSet):
    queryset = PEA.objects.all()
    serializer_class = PEA_Serializer


class PEA_AULAViewSet(generics.ListAPIView):
    serializer_class = PEA_AULASerializer

    def get_queryset(self):
        id_localambiente = self.kwargs['id_localambiente']
        return PEA_AULA.objects.filter(id_localambiente=id_localambiente, id_pea__baja_estado=0)


class PEA_AULAbyLocalAmbienteViewSet(generics.ListAPIView):
    serializer_class = PEA_AULASerializer

    def get_queryset(self):
        id_localambiente = self.kwargs['id_localambiente']
        return PEA_AULA.objects.filter(id_localambiente=id_localambiente)


class PEA_CURSOCRITERIOViewSet(generics.ListAPIView):
    serializer_class = PEA_CURSOCRITERIOSerializer

    def get_queryset(self):
        id_peaaula = self.kwargs['id_peaaula']
        return PEA_CURSOCRITERIO.objects.filter(id_peaaula=id_peaaula)


@csrf_exempt
def sobrantes_zona(request):
    if request.method == "POST" and request.is_ajax():
        ubigeo = request.POST['ubigeo']
        zona = request.POST['zona']
        id_curso = request.POST['id_curso']
        contingencia = request.POST['contingencia']
        sobrantes = PEA.objects.exclude(id_pea__in=PEA_AULA.objects.values('id_pea')).annotate(
            cargo=F('id_cargofuncional__nombre_funcionario')).filter(ubigeo=ubigeo,
                                                                     zona=zona,
                                                                     id_cargofuncional__cursofuncionario__id_curso_id=id_curso,
                                                                     contingencia=contingencia).order_by(
            'ape_paterno').values('dni', 'ape_paterno', 'ape_materno', 'nombre',
                                  'cargo', 'id_pea')
        return JsonResponse(list(sobrantes), safe=False)

    return JsonResponse({'msg': False})


@csrf_exempt
def getMeta(request):
    if request.method == "POST" and request.is_ajax():
        id_curso = request.POST['id_curso']
        ubigeo = request.POST['ubigeo']
        zona = request.POST['zona']
        meta = PEA.objects.filter(id_cargofuncional__cursofuncionario__id_curso=id_curso, ubigeo=ubigeo,
                                  zona=zona, contingencia=0).count()

        capacidad_zona = LocalAmbiente.objects.filter(id_local__zona=zona, id_local__ubigeo=ubigeo,
                                                      id_local__id_curso=id_curso).aggregate(
            cantidad_zona=Sum('capacidad'))
        capacidad_distrito = LocalAmbiente.objects.filter(id_local__ubigeo=ubigeo,
                                                          id_local__id_curso=id_curso).aggregate(
            cantidad_distrito=Sum('capacidad'))

        return JsonResponse({'cant': meta, 'cantidad_zona': capacidad_zona['cantidad_zona'],
                             'cantidad_distrito': capacidad_distrito['cantidad_distrito']}, safe=False)

    return JsonResponse({'msg': False})


@csrf_exempt
def asignar(request):
    if request.method == "POST" and request.is_ajax():
        data = request.POST
        ubigeo = data['ubigeo']
        zona = data['zona']
        curso = data['id_curso']

        if curso == '5':
            return JsonResponse(distribucion_curso5(ubigeo, zona, curso), safe=False)
        else:
            if 'zona' in data:
                locales_zona = Local.objects.filter(ubigeo=ubigeo, zona=zona, id_curso=curso)
            else:
                locales_zona = Local.objects.filter(ubigeo=ubigeo, id_curso=curso)

            for e in locales_zona:
                aulas_by_local = LocalAmbiente.objects.filter(id_local=e.id_local).order_by('-capacidad')
                for a in aulas_by_local:
                    disponibilidad = disponibilidad_aula(a.id_localambiente)
                    if disponibilidad > 0:
                        if 'contingencia' not in data:
                            pea_ubicar = PEA.objects.exclude(
                                id_pea__in=PEA_AULA.objects.values('id_pea')).filter(
                                ubigeo=ubigeo, zona=zona, contingencia=0, baja_estado=0,
                                id_cargofuncional__in=Funcionario.objects.filter(id_curso=e.id_curso)).order_by(
                                'ape_paterno')[:a.capacidad]
                        else:
                            pea_ubicar = PEA.objects.exclude(
                                id_pea__in=PEA_AULA.objects.filter(id_pea__baja_estado=0).values('id_pea')).filter(
                                pk__in=data['contingencia'])[:disponibilidad]
                        for p in pea_ubicar:
                            pea = PEA.objects.get(pk=p.id_pea)
                            aula = LocalAmbiente.objects.get(pk=a.id_localambiente)
                            pea_aula = PEA_AULA(id_pea=pea, id_localambiente=aula)
                            pea_aula.save()

            return JsonResponse({'msg': True})

    return JsonResponse({'msg': False})


"""
EMPADRONADOR URBANO : 901
EMPADRONADOR RURAL : 284
JEFE DE SECCION URBANO : 165
JEFE DE SECCION RURAL : 3
"""


def distribucion_curso5(ubigeo, zona, curso):
    locales = Local.objects.filter(ubigeo=ubigeo, zona=zona, id_curso=curso)
    cargos = list(CursoFuncionario.objects.filter(id_curso=curso).values_list('id_funcionario', flat=True))
    pea_distribuida = []
    pea_distribuida_junta = {'pea_dia1': [], 'pea_dia2': [], 'pea_jefe_rural': []}
    pea_ok = list(PEA_AULA.objects.values_list('id_pea', flat=True))
    for i in cargos:
        pea_cantidad = PEA.objects.filter(ubigeo=ubigeo, zona=zona, id_cargofuncional=i, contingencia=0,
                                          baja_estado=0).count()
        pea_dia1_ids = list(
            PEA.objects.exclude(id_pea__in=pea_ok).filter(ubigeo=ubigeo, zona=zona, id_cargofuncional=i,
                                                          contingencia=0, baja_estado=0).values_list(
                'id_pea', flat=True))[:pea_cantidad / 2]
        pea_distribuida.append(
            {'id_cargofuncional': i,
             'pea_dia1': pea_dia1_ids,
             'pea_dia2': list(PEA.objects.exclude(id_pea__in=pea_dia1_ids).filter(
                 ubigeo=ubigeo, zona=zona, id_cargofuncional=i, contingencia=0, baja_estado=0).values_list(
                 'id_pea', flat=True))})

    for d in pea_distribuida:
        if d['id_cargofuncional'] != 3:
            pea_distribuida_junta['pea_dia1'] = pea_distribuida_junta['pea_dia1'] + d['pea_dia1']
            pea_distribuida_junta['pea_dia2'] = pea_distribuida_junta['pea_dia2'] + d['pea_dia2']

        else:
            pea_distribuida_junta['pea_dia1'] = pea_distribuida_junta['pea_dia1'] + d['pea_dia1'] + d['pea_dia2']
            pea_distribuida_junta['pea_jefe_rural'] = d['pea_dia1'] + d['pea_dia2']

    pea_a_distribuir = [{'pea': pea_distribuida_junta['pea_dia1'], 'dia': 1},
                        {'pea': pea_distribuida_junta['pea_dia2'], 'dia': 2},
                        {'pea': pea_distribuida_junta['pea_jefe_rural'], 'dia': 2, 'jefe_rural': 1}]

    for k in pea_a_distribuir:
        for i in locales:
            for a in i.localambiente_set.all():
                disponibilidad = disponibilidad_aula(a.id_localambiente, True, k['dia'])
                if disponibilidad > 0:
                    if 'jefe_rural' not in k:
                        pea_ubicar = k['pea'][:disponibilidad]
                        k['pea'] = list(set(k['pea']) - set(pea_ubicar))
                        for u in pea_ubicar:
                            if k['dia'] == 1:
                                fecha = i.fecha_inicio
                            else:
                                fecha = i.fecha_fin
                            pea = PEA_AULA(id_pea_id=u, id_localambiente_id=a.id_localambiente, pea_fecha=fecha)
                            pea.save()
                    else:
                        if int(a.capacidad) == disponibilidad:
                            pea_ubicar = k['pea'][:disponibilidad]
                            k['pea'] = list(set(k['pea']) - set(pea_ubicar))
                            for u in pea_ubicar:
                                if k['dia'] == 1:
                                    fecha = i.fecha_inicio
                                else:
                                    fecha = i.fecha_fin
                                pea = PEA_AULA(id_pea_id=u, id_localambiente_id=a.id_localambiente, pea_fecha=fecha)
                                pea.save()

    return pea_distribuida_junta


def disponibilidad_aula(aula, curso5=False, dia=1):
    aula = LocalAmbiente.objects.get(pk=aula)
    if dia == 1:
        fecha = aula.id_local.fecha_inicio
    else:
        fecha = aula.id_local.fecha_fin

    if curso5:
        cantidad_asignada = PEA_AULA.objects.filter(id_localambiente=aula, id_pea__baja_estado=0,
                                                    pea_fecha=fecha).count()
    else:
        cantidad_asignada = PEA_AULA.objects.filter(id_localambiente=aula, id_pea__baja_estado=0).count()

    if aula.capacidad == None:
        return 0
    return aula.capacidad - cantidad_asignada


"""
TURNO
0 = MANANA
1 = TARDE
2 = TODO EL DIA
"""


@csrf_exempt
def redistribuir_aula(request, id_localambiente):
    PEA_AULA.objects.filter(id_localambiente=id_localambiente).delete()

    return JsonResponse({'msg': True}, safe=False)


def getRangeDatesLocal(request, id_local):
    format_fechas = []
    local = Local.objects.filter(pk=id_local).values('fecha_inicio', 'fecha_fin', 'turno_uso_local')
    fecha_inicio = datetime.strptime(local[0]['fecha_inicio'], '%d/%m/%Y').strftime('%Y-%m-%d')
    fecha_fin = datetime.strptime(local[0]['fecha_fin'], '%d/%m/%Y').strftime('%Y-%m-%d')
    rango_fechas = pd.Series(pd.date_range(fecha_inicio, fecha_fin).format())
    for f in rango_fechas:
        format_fechas.append(datetime.strptime(f, '%Y-%m-%d').strftime('%d/%m/%Y'))

    return JsonResponse({'fechas': format_fechas, 'turno': local[0]['turno_uso_local']}, safe=False)


def getPeaAsistencia(request):
    id_localambiente = request.POST['id_localambiente']
    fecha = request.POST['fecha']
    pea = PEA_AULA.objects.filter(id_localambiente=id_localambiente).annotate(
        nombre_completo=Concat(
            'id_pea__ape_paterno', Value(' '), 'id_pea__ape_materno', Value(' '), 'id_pea__nombre'),
        cargo=F('id_pea__cargo')).values('nombre_completo', 'cargo', 'id_pea__pea_aula__pea_asistencia__turno_manana',
                                         'id_pea__pea_aula__pea_asistencia__turno_tarde')

    return JsonResponse(list(pea), safe=False)


class PEA_AULACurso5ViewSet(generics.ListAPIView):
    serializer_class = PEA_AULASerializer

    def get_queryset(self):
        id_localambiente = self.request.POST['id_localambiente']
        fecha = self.request.POST['fecha']
        return PEA_AULA.objects.filter(id_localambiente=id_localambiente, pea_fecha=fecha)

    def post(self, request, *args, **kwargs):
        return super(PEA_AULACurso5ViewSet, self).get(request, *args, **kwargs)


@csrf_exempt
def save_asistencia(request):
    if request.method == "POST" and request.is_ajax():
        data = json.loads(request.body)

        for i in data:
            try:
                pea = PEA_ASISTENCIA.objects.get(fecha=i['fecha'],
                                                 id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']))
            except ObjectDoesNotExist:
                pea = None

            if pea is None:
                pea_asistencia = PEA_ASISTENCIA(fecha=i['fecha'], turno_manana=i['turno_manana'],
                                                turno_tarde=i['turno_tarde'],
                                                id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']))
                pea_asistencia.save()
            else:
                pea_asistencia = PEA_ASISTENCIA.objects.get(fecha=i['fecha'],
                                                            id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']))
                pea_asistencia.turno_tarde = i['turno_tarde']
                pea_asistencia.turno_manana = i['turno_manana']
                pea_asistencia.save()

    return JsonResponse({'msg': True})


def getCriteriosCurso(request, id_curso):
    criterios = list(
        CursoCriterio.objects.filter(id_curso=id_curso).annotate(
            criterio=F('id_criterio__nombre_criterio')).values('id_cursocriterio', 'criterio', 'ponderacion',
                                                               'id_criterio'))

    return JsonResponse(criterios, safe=False)


@csrf_exempt
def save_notas(request):
    if request.method == "POST" and request.is_ajax():
        data = json.loads(request.body)

        for i in data:
            try:
                pea = PEA_CURSOCRITERIO.objects.get(
                    id_cursocriterio=CursoCriterio.objects.get(pk=i['id_cursocriterio']),
                    id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']))
            except ObjectDoesNotExist:
                pea = None

            if pea is None:
                pea_cursocriterio = PEA_CURSOCRITERIO(nota=i['nota'],
                                                      id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']),
                                                      id_cursocriterio=CursoCriterio.objects.get(
                                                          pk=i['id_cursocriterio']))
                pea_cursocriterio.save()
            else:
                pea_cursocriterio = PEA_CURSOCRITERIO.objects.get(id_cursocriterio=CursoCriterio.objects.get(
                    pk=i['id_cursocriterio']),
                    id_peaaula=PEA_AULA.objects.get(pk=i['id_peaaula']))
                pea_cursocriterio.nota = i['nota']
                pea_cursocriterio.save()

    return JsonResponse({'msg': True})


@csrf_exempt
def generar_ambientes(request):
    if request.method == "POST" and request.is_ajax():
        data = request.POST
        ambientes = {}
        for i in data:
            if data[i] == '':
                ambientes[i] = 0
            else:
                ambientes[i] = int(data[i])

        id_local = data['id_local']
        object = {
            'cantidad_usar_aulas': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=1).count(),
                                           ambientes['cantidad_usar_aulas']), 1],
            'cantidad_usar_auditorios': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=2).count(),
                                                ambientes['cantidad_usar_auditorios']), 2],
            'cantidad_usar_sala': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=3).count(),
                                          ambientes['cantidad_usar_sala']), 3],
            'cantidad_usar_oficina': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=4).count(),
                                             ambientes['cantidad_usar_oficina']), 4],
            'cantidad_usar_computo': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=5).count(),
                                             ambientes['cantidad_usar_computo']), 5],
            'cantidad_usar_otros': [restar(LocalAmbiente.objects.filter(id_local=id_local, id_ambiente=6).count(),
                                           ambientes['cantidad_usar_otros']), 6]
        }

        for i in object:
            if object[i][0] > 0:
                for a in range(object[i][0]):
                    localambiente = LocalAmbiente(id_local=Local.objects.get(pk=id_local),
                                                  id_ambiente=Ambiente.objects.get(pk=object[i][1]))
                    localambiente.save()
            elif object[i][0] < 0:
                borrar = LocalAmbiente.objects.filter(id_local=Local.objects.get(pk=id_local),
                                                      id_ambiente=Ambiente.objects.get(pk=object[i][1])). \
                             order_by('-id_localambiente')[:(-1 * object[i][0])]

                LocalAmbiente.objects.filter(pk__in=borrar).delete()

    return JsonResponse({'msg': True})


@csrf_exempt
def get_funcionarioinei(request, id_per):
    funcionarios = list(FuncionariosINEI.objects.filter(id_per=id_per).values())

    return JsonResponse(funcionarios, safe=False)


@csrf_exempt
def update_peaaula(request, id_localambiente, id_instructor):
    PEA_AULA.objects.filter(id_localambiente=id_localambiente).update(id_instructor=id_instructor)

    return JsonResponse({'msg': True}, safe=False)


@csrf_exempt
def darBajaPea(request):
    id_pea = request.POST.getlist('id_peas[]')

    for i in id_pea:
        pea = PEA.objects.get(pk=i)
        pea.baja_estado = 1
        pea.save()

    return JsonResponse({'msg': True}, safe=False)


@csrf_exempt
def darAltaPea(request):
    id_pea = request.POST.getlist('id_peas[]')

    for i in id_pea:
        pea = PEA.objects.get(pk=i)
        pea.contingencia = 0
        pea.alta_estado = 1
        pea.save()

    return JsonResponse({'msg': True}, safe=False)


class obj(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
                setattr(self, a, [obj(x) if isinstance(x, dict) else x for x in b])
            else:
                setattr(self, a, obj(b) if isinstance(b, dict) else b)


def restar(num, num2):
    return int(num2) - int(num)
