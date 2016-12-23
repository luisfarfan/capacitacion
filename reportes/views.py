from django.shortcuts import render
from capacitacion.models import *
from django.db.models import Count, Value
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, Sum
from datetime import datetime
from django.db.models.functions import Concat
from django.core.exceptions import ObjectDoesNotExist
import json


# Create your views here.

def TotalLocales(request):
    query = Local.objects.values('id_curso', 'id_curso__nombre_curso').annotate(dcount=Count('id_local'))


def RelacionLocales(request):
    query = Local.objects.values('id_curso', 'id_curso__nombre_curso')


def TotalAulas(request):
    query = LocalAmbiente.objects.values('id_local__id_curso', 'id_local__id_curso__nombre_curso').annotate(
        dcount=Count('id_localambiente'))


def TotalPostulantesSeleccionados(request):
    query = PEA.objects.values('id_cargofuncional__id_curso', 'id_cargofuncional__id_curso__nombre_curso').annotate(
        dcount=Count('id_pea'))


def TotalPostulantesQueAsistieron(request):
    query = PEA.objects.values('id_cargofuncional__id_curso', 'id_cargofuncional__id_curso__nombre_curso').annotate(
        dcount=Count('id_pea'))
