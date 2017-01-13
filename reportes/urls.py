from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^seguridad/', include('seguridad.urls', namespace='seguridad')),
    url(r'^rest/', include('api_rest.urls', namespace='api_rest')),
]
