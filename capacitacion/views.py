from rest_framework.views import APIView
from django.db.models import Count, Value
from django.http import JsonResponse
from django.http import HttpResponse
from django.template import loader
from serializer import *
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F
from datetime import datetime
import pandas as pd
from django.db.models.functions import Concat
from django.core.exceptions import ObjectDoesNotExist
import json


def modulo_registro(request):
    template = loader.get_template('capacitacion/modulo_registro.html')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'REGISTRO DE LOCAL'
    }
    return HttpResponse(template.render(context, request))


def cursos_evaluaciones(request):
    template = loader.get_template('capacitacion/cursos_evaluaciones.html')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Cursos y Evaluaciones'
    }
    return HttpResponse(template.render(context, request))


def asistencia(request):
    template = loader.get_template('capacitacion/asistencia.html')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Modulo de Asistencia'
    }
    return HttpResponse(template.render(context, request))


def distribucion(request):
    template = loader.get_template('capacitacion/distribucion.html')
    context = {
        'titulo_padre': 'Capacitacion',
        'titulo_hijo': 'Modulo de Distribucion'
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
        return Local.objects.filter(ubigeo=ubigeo)


class TbLocalByZonaViewSet(generics.ListAPIView):
    serializer_class = LocalAulasSerializer

    def get_queryset(self):
        ubigeo = self.kwargs['ubigeo']
        zona = self.kwargs['zona']
        return Local.objects.filter(ubigeo=ubigeo, zona=zona)


def TbLocalAmbienteByLocalViewSet(request, id_local):
    query = LocalAmbiente.objects.filter(id_local=id_local).order_by('-capacidad').annotate(
        nombre_ambiente=F('id_ambiente__nombre_ambiente')).values(
        'id_localambiente', 'numero', 'capacidad', 'nombre_ambiente')
    return JsonResponse(list(query), safe=False)


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


class PEA_AULAViewSet(generics.ListAPIView):
    serializer_class = PEA_AULASerializer

    def get_queryset(self):
        id_localambiente = self.kwargs['id_localambiente']
        return PEA_AULA.objects.filter(id_localambiente=id_localambiente)


class PEA_AULAbyLocalAmbienteViewSet(generics.ListAPIView):
    serializer_class = PEA_AULASerializer

    def get_queryset(self):
        id_localambiente = self.kwargs['id_localambiente']
        return PEA_AULA.objects.filter(id_localambiente=id_localambiente)


@csrf_exempt
def sobrantes_zona(request):
    if request.method == "POST" and request.is_ajax():
        ubigeo = request.POST['ubigeo']
        zona = request.POST['zona']
        sobrantes = PEA.objects.exclude(id_pea__in=PEA_AULA.objects.values('id_pea')).filter(ubigeo=ubigeo,
                                                                                             zona=zona).order_by(
            'ape_paterno').values('dni', 'ape_paterno', 'ape_materno', 'nombre', 'cargo')
        return JsonResponse(list(sobrantes), safe=False)

    return JsonResponse({'msg': False})


@csrf_exempt
def asignar(request):
    if request.method == "POST" and request.is_ajax():
        ubigeo = request.POST['ubigeo']
        zona = request.POST['zona']
        locales_zona = Local.objects.filter(ubigeo=ubigeo, zona=zona)
        for e in locales_zona:
            aulas_by_local = LocalAmbiente.objects.filter(id_local=e.id_local).order_by('-capacidad')
            for a in aulas_by_local:
                if disponibilidad_aula(a.id_localambiente):
                    pea_ubicar = PEA.objects.exclude(id_pea__in=PEA_AULA.objects.values('id_pea')).filter(
                        ubigeo=ubigeo, zona=zona,
                        id_cargofuncional__in=Funcionario.objects.filter(id_curso=e.id_curso)).order_by(
                        'ape_paterno')[:a.capacidad]
                    for p in pea_ubicar:
                        pea = PEA.objects.get(pk=p.id_pea)
                        aula = LocalAmbiente.objects.get(pk=a.id_localambiente)
                        pea_aula = PEA_AULA(id_pea=pea, id_localambiente=aula)
                        pea_aula.save()

        return JsonResponse({'msg': True})

    return JsonResponse({'msg': False})


def disponibilidad_aula(aula):
    aula = LocalAmbiente.objects.get(pk=aula)
    cantidad_asignada = PEA_AULA.objects.filter(id_localambiente=aula).count()
    is_disponible = True

    if cantidad_asignada >= aula.capacidad:
        is_disponible = False

    return is_disponible


"""
TURNO
0 = MANANA
1 = TARDE
2 = TOOD EL DIA
"""


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
