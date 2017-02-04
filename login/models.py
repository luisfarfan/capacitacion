from __future__ import unicode_literals
from django.contrib import admin
from capacitacion.models import Curso
from django.db import models


# Create your models here.
class User(models.Model):
    usuario = models.CharField(max_length=20)
    clave = models.CharField(max_length=200)
    nombre_completo = models.CharField(max_length=200)
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    zona = models.CharField(max_length=5, null=True, blank=True)
    curso = models.ForeignKey(Curso, null=True, blank=True)
    rol = models.ForeignKey('Rol', null=True)
    cierre = models.IntegerField(default=0)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'nombre_completo', 'ccdd', 'ccpp', 'ccdi', 'zona', 'curso')


class Rol(models.Model):
    rol = models.CharField(max_length=200)

    class Meta:
        managed = True
        db_table = 'ROL'


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('rol',)


class Menu(models.Model):
    nombre = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    class Meta:
        managed = True
        db_table = 'MENU'


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'order')
