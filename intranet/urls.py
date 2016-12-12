"""intranet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from capacitacion.views import *
from capacitacion.urls import *
from login.views import login, do_login

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^rest/', include(router.urls)),
    url(r'^$', login, name='login'),
    url(r'^do_login/$', do_login),
    url(r'^asignacion/$', asignar),
    url(r'^sobrantes_zona/$', sobrantes_zona),
    url(r'^modulo_registro/$', modulo_registro, name='modulo_registro'),
    url(r'^asistencia/$', asistencia, name='asistencia'),
    url(r'^cursos_evaluaciones/$', cursos_evaluaciones, name='cursos_evaluaciones'),
    url(r'^distribucion/$', distribucion, name='distribucion'),
    url(r'^departamentos/$', DepartamentosList.as_view()),
    url(r'^provincias/(?P<ccdd>[0-9]+)/$', ProvinciasList.as_view()),
    url(r'^distritos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        DistritosList.as_view()),
    url(r'^zonas/(?P<ubigeo>[0-9]+)/$', ZonasList.as_view()),
    url('^localubigeo/(?P<ubigeo>.+)/$', TbLocalByUbigeoViewSet.as_view()),
    url('^localambiente/(?P<id_local>.+)/$', TbLocalAmbienteByLocalViewSet),
    url('^cursobyetapa/(?P<id_etapa>.+)/$', CursobyEtapaViewSet.as_view()),
    url('^cursocriteriobycurso/(?P<id_curso>.+)/$', CursoCriteriobyCursoViewSet.as_view()),
    url('^localbyzona/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/$', TbLocalByZonaViewSet.as_view()),
    url('^getRangeDatesLocal/(?P<id_local>.+)/$', getRangeDatesLocal),
    url('^getPeaAsistencia/$', getPeaAsistencia),
    url('^peaaulabylocalambiente/(?P<id_localambiente>.+)/$', PEA_AULAbyLocalAmbienteViewSet.as_view()),
    url('^peaaulaasistencia/(?P<id_localambiente>.+)/$', PEA_AULAViewSet.as_view()),
    # url('^localambiente/(?P<id_local>.+)/(?P<id_ambiente>.+)/$', LocalAmbienteByLocalAulaViewSet.as_view()),
    url('^save_asistencia/$', save_asistencia),

]
