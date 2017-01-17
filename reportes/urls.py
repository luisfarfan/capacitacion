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
    url(r'^api_directorio_locales/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        ApiDirectorioLocales),
    url(r'^api_aulas_coberturas_curso/(?P<ubigeo>[0-9]+)/(?P<id_curso>[0-9]+)/$', ApiAulasCoberturadasPorCurso),
]
