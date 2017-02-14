# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-16 20:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('capacitacion', '0004_marcolocal_ubigeo'),
    ]

    operations = [
        migrations.CreateModel(
            name='UbigeoCursoMeta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='capacitacion.Curso')),
                ('ubigeo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='capacitacion.Ubigeo')),
            ],
            options={
                'db_table': 'UBIGEO_CURSO_META',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='curso',
            name='metas',
            field=models.ManyToManyField(through='capacitacion.UbigeoCursoMeta', to='capacitacion.Ubigeo'),
        ),
    ]
