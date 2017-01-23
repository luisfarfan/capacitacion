from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    url(r'^directorio_locales/', TemplateView.as_view(template_name='capacitacion/reportes/directoriolocales.html'),
        name='directorio_locales'),
    url(r'^numero_aulas_coberturadas_por_curso/',
        TemplateView.as_view(template_name='capacitacion/reportes/numero-de-aulas-coberturadas-por-curso.html'),
        name='numero_aulas_coberturadas_por_curso'),
    url(r'^relacion-postulantes-que-asistieron-por-curso/',
        TemplateView.as_view(template_name='capacitacion/reportes/relacion-postulantes-asistieron-por-curso.html'),
        name='relacion-postulantes-que-asistieron-por-curso'),
    url(r'^personal_baja_por_curso/',
        TemplateView.as_view(template_name='capacitacion/reportes/personal_baja_por_curso.html'),
        name='personal_baja_por_curso'),
    url(r'^api_directorio_locales/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        ApiDirectorioLocales),
    url(r'^api_aulas_coberturas_curso/(?P<ubigeo>[0-9]+)/(?P<id_curso>[0-9]+)/$', ApiAulasCoberturadasPorCurso),
    url(r'^api_aulas_coberturas_curso/(?P<ubigeo>[0-9]+)/(?P<id_curso>[0-9]+)/$', ApiAulasCoberturadasPorCurso),
    url(r'^api_personal_baja_por_curso/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalQueSeDioDeBajaPorCurso),
    url(r'^personal_alta_por_curso/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalQueSeDioDeAltaPorCurso),
    url(r'^aprobados_por_curso/(?P<ubigeo>[0-9]+)/(?P<cargo>[0-9]+)/$',
        AprobadosPorCargo),

]
