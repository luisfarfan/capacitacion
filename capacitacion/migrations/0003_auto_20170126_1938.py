# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-27 00:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('capacitacion', '0002_peanotafinal_seleccionado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pea',
            name='baja_estado',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
