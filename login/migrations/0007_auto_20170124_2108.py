# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-25 02:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_auto_20170124_2043'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='curso',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='capacitacion.Curso'),
        ),
    ]