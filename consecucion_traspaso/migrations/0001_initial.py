# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-27 00:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PersonalCapacitacion',
            fields=[
                ('id_per', models.IntegerField(primary_key=True, serialize=False)),
                ('dni', models.CharField(blank=True, max_length=8, null=True)),
                ('ape_paterno', models.CharField(blank=True, db_column='ape_paterno', max_length=100, null=True)),
                ('ape_materno', models.CharField(blank=True, db_column='ape_materno', max_length=100, null=True)),
                ('nombre', models.CharField(blank=True, db_column='nombre', max_length=100, null=True)),
                ('id_cargofuncional', models.IntegerField()),
                ('id_convocatoria_cargo', models.IntegerField()),
                ('zona', models.CharField(blank=True, max_length=5, null=True)),
                ('contingencia', models.IntegerField(blank=True, null=True)),
                ('ubigeo', models.CharField(max_length=6)),
                ('correo', models.CharField(blank=True, max_length=100, null=True)),
                ('telefono', models.CharField(blank=True, max_length=100, null=True)),
                ('celular', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'v_personal_capacitacion',
                'managed': False,
            },
        ),
    ]