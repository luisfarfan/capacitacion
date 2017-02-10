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
from login.views import login, do_login, updateUserSession
from consecucion_traspaso.views import *

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^rest/', include(router.urls)),
    url(r'^reportes/', include('reportes.urls', namespace='reporte')),
    url(r'^$', login, name='login'),
    url(r'^do_login/$', do_login),
    url(r'^updateUserSession/(?P<id>[0-9]+)/$', updateUserSession),

    url(r'^asignacion/$', asignar),
    url(r'^sobrantes_zona/$', sobrantes_zona),
    url(r'^modulo_registro/$', modulo_registro, name='modulo_registro'),
    url(r'^asistencia/$', asistencia, name='asistencia'),
    url(r'^cursos_evaluaciones/$', cursos_evaluaciones, name='cursos_evaluaciones'),
    url(r'^distribucion/$', distribucion, name='distribucion'),
    url(r'^evaluacion/$', evaluacion, name='evaluacion'),
    url(r'^departamentos/$', DepartamentosList.as_view()),
    url(r'^provincias/(?P<ccdd>[0-9]+)/$', ProvinciasList.as_view()),
    url(r'^distritos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        DistritosList.as_view()),
    url(r'^zonas/(?P<ubigeo>[0-9]+)/$', ZonasList.as_view()),
    url('^localubigeo/(?P<ubigeo>.+)/(?P<id_curso>.+)/$', TbLocalByUbigeoViewSet.as_view()),
    # url('^localmarco/(?P<ubigeo>.+)/(?P<zona>.+)/$', TbLocalByMarcoViewSet.as_view()),
    url('^localmarco/(?P<ubigeo>.+)/$', TbLocalByMarcoViewSet.as_view()),
    url('^directoriolocal/(?P<ubigeo>.+)/$', TbDirectorioLocalViewSet.as_view()),
    url('^copy_directorio_to_seleccionado/(?P<id_directoriolocal>.+)/(?P<id_curso>.+)/$',
        copy_directorio_to_seleccionado),
    url('^delete_curso_local/(?P<id_local>.+)/(?P<curso>.+)/$',
        delete_curso_local),
    url('^getDirectoriolocal/(?P<ubigeo>.+)/$', getDirectoriolocal),
    url('^localzona/(?P<ubigeo>.+)/(?P<curso>.+)/(?P<zona>.+)/$', TbLocalByZonaViewSet.as_view()),
    url('^localambiente/(?P<id_local>[0-9]+)/$', TbLocalAmbienteByLocalViewSet),
    url('^localambiente/(?P<id_local>[0-9]+)/(?P<fecha>[0-9]+)/$', TbLocalAmbienteByLocalViewSet),
    url('^directorio_localambiente/(?P<id_local>[0-9]+)/$', Directorio_Local_Ambientes),
    url('^cursobyetapa/(?P<id_etapa>.+)/$', CursobyEtapaViewSet.as_view()),
    url('^cursocriteriobycurso/(?P<id_curso>.+)/$', CursoCriteriobyCursoViewSet.as_view()),
    url('^localbyzona/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/$', TbLocalByZonaViewSet.as_view()),
    url('^getRangeDatesLocal/(?P<id_local>.+)/$', getRangeDatesLocal),
    url('^getPeaAsistencia/$', getPeaAsistencia),
    url('^peaaulabylocalambiente/(?P<id_localambiente>.+)/$', PEA_AULAbyLocalAmbienteViewSet.as_view()),
    url('^peaaulaasistencia/(?P<id_localambiente>.+)/$', PEA_AULAViewSet.as_view()),
    url('^getPeaCurso5/$', PEA_AULACurso5ViewSet.as_view()),
    url('^getMeta/$', getMeta),
    # url('^localambiente/(?P<id_local>.+)/(?P<id_ambiente>.+)/$', LocalAmbienteByLocalAulaViewSet.as_view()),
    url('^save_asistencia/$', save_asistencia),
    url('^getCriteriosCurso/(?P<id_curso>[0-9]+)/$', getCriteriosCurso),
    url('^save_notas/$', save_notas),
    url('^save_nota_final/$', save_nota_final),
    url('^pea_notas/(?P<id_peaaula>.+)/$', PEA_CURSOCRITERIOViewSet.as_view()),
    url('^generar_ambientes/$', generar_ambientes),
    url('^get_funcionarioinei/(?P<id_per>.+)/$', get_funcionarioinei),
    url('^update_peaaula/(?P<id_localambiente>.+)/(?P<id_instructor>.+)/$', update_peaaula),
    url('^darBajaPea/$', darBajaPea),
    url('^darAltaPea/$', darAltaPea),
    url('^redistribuir_aula/(?P<id_localambiente>.+)/$', redistribuir_aula),
    url('^save_aprobado_distrital/$', save_aprobado_distrital),
    url('^traer_consecucion/$', traer_consecucion),
    url('^update_consecucion/$', update_consecucion),
    url('^getMetaConsecucion/(?P<ubigeo>.+)/(?P<curso>.+)/$', getMetaConsecucion),
    url('^traer_consecucion_curso3_grupo2/$', traer_consecucion_curso3_grupo2),
    url('^cerrarCurso/(?P<id_usuario>.+)/$', cerrarCurso),
    url('^peaCurso6/(?P<ubigeo>.+)/$', peaCurso6),
    url('^cerrarDia1Grupo6/(?P<ccdd>.+)/(?P<ccpp>.+)/(?P<ccdi>.+)/(?P<dia>[0-9]+)/$', cerrarDia1Grupo6),
    url('^saveAsistenciaCurso6/$', saveAsistenciaCurso6),
]
