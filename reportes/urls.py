from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    url(r'^reportes_capacitacion/', TemplateView.as_view(template_name='capacitacion/reportes/directoriolocales.html'),
        name='reportes'),
    url(r'^getReportesList/$', getReportesList),

    url(r'^api_directorio_locales/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', ApiDirectorioLocales),
    url(r'^api_directorio_locales/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ApiDirectorioLocales),
    url(
        r'^api_directorio_locales/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        ApiDirectorioLocales),
    url(r'^api_aulas_coberturas_curso/(?P<id_curso>[0-9]+)/$', ApiAulasCoberturadasPorCurso),
    url(r'^api_aulas_coberturas_curso/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        ApiAulasCoberturadasPorCurso),
    url(r'^api_aulas_coberturas_curso/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        ApiAulasCoberturadasPorCurso),
    url(
        r'^api_aulas_coberturas_curso/(?P<id_curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ApiAulasCoberturadasPorCurso),
    url(r'^api_personal_baja_por_curso/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalQueSeDioDeBajaPorCurso),
    url(r'^api_personal_alta_por_curso/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalQueSeDioDeAltaPorCurso),
    url(r'^aprobados_segun_cargo/(?P<ubigeo>[0-9]+)/(?P<cargo>[0-9]+)/$',
        AprobadosPorCargo),
    url(r'^aprobados_curso/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/(?P<curso>[0-9]+)/$',
        AprobadosPorUbigeoCurso),
    url(r'^ReporteTotalCantidades/(?P<id_funcionario>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ReporteTitularesBajasAltasReservasEtc),
]
