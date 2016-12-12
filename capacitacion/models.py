from __future__ import unicode_literals

from django.db import models


# Create your models here.
class Ubigeo(models.Model):
    ubigeo = models.CharField(primary_key=True, max_length=6)
    ccdd = models.CharField(max_length=2, blank=True, null=True)
    ccpp = models.CharField(max_length=2, blank=True, null=True)
    ccdi = models.CharField(max_length=2, blank=True, null=True)
    departamento = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    distrito = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'MAE_UBIGEO'


class Zona(models.Model):
    ID = models.IntegerField(primary_key=True)
    UBIGEO = models.CharField(max_length=6)
    ZONA = models.CharField(max_length=5)
    LLAVE_CCPP = models.CharField(max_length=10)
    LLAVE_ZONA = models.CharField(max_length=15)
    ETIQ_ZONA = models.CharField(max_length=6)

    class Meta:
        managed = False
        db_table = 'TB_ZONA'


class Etapa(models.Model):
    id_etapa = models.AutoField(primary_key=True, db_column='id_etapa')
    cod_etapa = models.CharField(max_length=3, blank=True, null=True)
    nombre_etapa = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ETAPA'


class Curso(models.Model):
    id_curso = models.AutoField(primary_key=True, db_column='id_curso')
    cod_curso = models.CharField(max_length=3, blank=True, null=True)
    nombre_curso = models.CharField(max_length=100, blank=True, null=True)
    id_etapa = models.ForeignKey('Etapa', db_column='id_etapa')
    funcionarios = models.ManyToManyField('Funcionario', through='CursoFuncionario')
    criterios = models.ManyToManyField('Criterio', through='CursoCriterio')
    nota_minima = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CURSO'


class CursoFuncionario(models.Model):
    id_cursofuncionario = models.AutoField(primary_key=True, db_column='id_cursofuncionario')
    id_funcionario = models.ForeignKey('Funcionario')
    id_curso = models.ForeignKey('Curso')

    class Meta:
        managed = True
        db_table = 'CURSO_FUNCIONARIO'


class Funcionario(models.Model):
    id_funcionario = models.AutoField(primary_key=True, db_column='id_funcionario')
    cod_funcionario = models.CharField(max_length=3, blank=True, null=True)
    nombre_funcionario = models.CharField(max_length=100, blank=True, null=True)
    id_curso = models.ForeignKey('Curso', db_column='id_curso')

    class Meta:
        managed = True
        db_table = 'FUNCIONARIO'


class Ambiente(models.Model):
    id_ambiente = models.AutoField(primary_key=True, db_column='id_ambiente')
    nombre_ambiente = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'AMBIENTE'


class LocalAmbiente(models.Model):
    id_localambiente = models.AutoField(primary_key=True, db_column='id_localambiente')
    id_local = models.ForeignKey('Local')
    id_ambiente = models.ForeignKey('Ambiente')
    mesas_cant = models.IntegerField(blank=True, null=True)
    sillas_cant = models.IntegerField(blank=True, null=True)
    carpindividuales_cant = models.IntegerField(blank=True, null=True)
    carpbipersonales_cant = models.IntegerField(blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    n_piso = models.IntegerField(blank=True, null=True)
    capacidad = models.IntegerField(blank=True, null=True)
    puerta_chapa = models.IntegerField(blank=True, null=True)
    puerta_pestillocandado = models.IntegerField(blank=True, null=True)
    puerta_notiene = models.IntegerField(blank=True, null=True)
    sshh = models.IntegerField(blank=True, null=True)
    alumbrado_electrico = models.IntegerField(blank=True, null=True)
    pizarra_acrilica = models.IntegerField(blank=True, null=True)
    pizarra_cemento = models.IntegerField(blank=True, null=True)
    proyector = models.IntegerField(blank=True, null=True)
    computadora = models.IntegerField(blank=True, null=True)
    acceso_internet = models.IntegerField(blank=True, null=True)
    aireacondicionado = models.IntegerField(blank=True, null=True)
    ventiladores = models.IntegerField(blank=True, null=True)
    pea = models.ManyToManyField('PEA', through='PEA_AULA')

    class Meta:
        managed = True
        db_table = 'LOCAL_AMBIENTE'

    def save(self, *args, **kwargs):
        self.numero = LocalAmbiente.objects.filter(id_local=self.id_local, id_ambiente=self.id_ambiente).count()
        self.numero = self.numero + 1

        return super(LocalAmbiente, self).save(*args, **kwargs)


class Local(models.Model):
    id_local = models.AutoField(primary_key=True, db_column='id_local')
    ambientes = models.ManyToManyField(Ambiente, through='LocalAmbiente')
    ubigeo = models.ForeignKey(Ubigeo)
    zona = models.CharField(max_length=5, blank=True, null=True)
    id_curso = models.ForeignKey('Curso')
    nombre_local = models.CharField(max_length=300, blank=True, null=True)
    zona_ubicacion_local = models.CharField(max_length=5, blank=True, null=True)
    tipo_via = models.CharField(max_length=300, blank=True, null=True)
    nombre_via = models.CharField(max_length=300, blank=True, null=True)
    referencia = models.CharField(max_length=300, blank=True, null=True)
    n_direccion = models.CharField(max_length=300, blank=True, null=True)
    km_direccion = models.CharField(max_length=300, blank=True, null=True)
    mz_direccion = models.CharField(max_length=300, blank=True, null=True)
    lote_direccion = models.CharField(max_length=300, blank=True, null=True)
    piso_direccion = models.CharField(max_length=300, blank=True, null=True)
    telefono_local_fijo = models.CharField(max_length=10, blank=True, null=True)
    telefono_local_celular = models.CharField(max_length=10, blank=True, null=True)
    fecha_inicio = models.CharField(max_length=100, blank=True, null=True)
    fecha_fin = models.CharField(max_length=100, blank=True, null=True)
    turno_uso_local = models.CharField(max_length=100, blank=True, null=True)
    capacidad_local_total = models.IntegerField(blank=True, null=True)
    capacidad_local_disponible = models.IntegerField(blank=True, null=True)
    capacidad_local_usar = models.IntegerField(blank=True, null=True)
    funcionario_nombre = models.CharField(max_length=100, blank=True, null=True)
    funcionario_email = models.CharField(max_length=100, blank=True, null=True)
    funcionario_telefono = models.CharField(max_length=100, blank=True, null=True)
    funcionario_celular = models.CharField(max_length=100, blank=True, null=True)
    responsable_nombre = models.CharField(max_length=100, blank=True, null=True)
    responsable_email = models.CharField(max_length=100, blank=True, null=True)
    responsable_telefono = models.CharField(max_length=100, blank=True, null=True)
    responsable_celular = models.CharField(max_length=100, blank=True, null=True)
    x = models.CharField(max_length=100, blank=True, null=True)
    y = models.CharField(max_length=100, blank=True, null=True)
    cantidad_total_aulas = models.IntegerField(blank=True, null=True)
    cantidad_disponible_aulas = models.IntegerField(blank=True, null=True)
    cantidad_usar_aulas = models.IntegerField(blank=True, null=True)
    cantidad_total_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_disponible_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_usar_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_total_sala = models.IntegerField(blank=True, null=True)
    cantidad_disponible_sala = models.IntegerField(blank=True, null=True)
    cantidad_usar_sala = models.IntegerField(blank=True, null=True)
    cantidad_total_oficina = models.IntegerField(blank=True, null=True)
    cantidad_disponible_oficina = models.IntegerField(blank=True, null=True)
    cantidad_usar_oficina = models.IntegerField(blank=True, null=True)
    cantidad_total_otros = models.IntegerField(blank=True, null=True)
    cantidad_disponible_otros = models.IntegerField(blank=True, null=True)
    cantidad_usar_otros = models.IntegerField(blank=True, null=True)
    especifique_otros = models.CharField(max_length=100, blank=True, null=True)
    cantidad_total_computo = models.IntegerField(blank=True, null=True)
    cantidad_disponible_computo = models.IntegerField(blank=True, null=True)
    cantidad_usar_computo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'LOCAL'


class Criterio(models.Model):
    id_criterio = models.AutoField(primary_key=True, db_column='id_criterio')
    nombre_criterio = models.CharField(max_length=100, blank=True, null=True)
    descripcion_criterio = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CRITERIO'


class CursoCriterio(models.Model):
    id_cursocriterio = models.AutoField(primary_key=True, db_column='id_cursocriterio')
    id_curso = models.ForeignKey('Curso', db_column='id_curso')
    id_criterio = models.ForeignKey('Criterio', db_column='id_criterio')
    # descripcion_criterio = models.CharField(max_length=100, blank=True, null=True)
    ponderacion = models.IntegerField()

    class Meta:
        managed = True
        unique_together = ('id_curso', 'id_criterio',)
        db_table = 'CURSO_CRITERIO'


class PEA(models.Model):
    id_pea = models.AutoField(primary_key=True, db_column='id_pea')
    id_per = models.CharField(max_length=8, blank=True, null=True)
    dni = models.CharField(max_length=8, blank=True, null=True)
    ape_paterno = models.CharField(max_length=100, blank=True, null=True, db_column='ape_paterno')
    ape_materno = models.CharField(max_length=100, blank=True, null=True, db_column='ape_materno')
    nombre = models.CharField(max_length=100, blank=True, null=True, db_column='nombre')
    id_cargofuncional = models.IntegerField(db_column='id_cargofuncional')
    cargo = models.CharField(max_length=50, blank=True, null=True, db_column='cargo')
    id_convocatoriacargo = models.CharField(max_length=4, blank=True, null=True, db_column='id_convocatoriacargo')
    zona = models.CharField(max_length=5, blank=True, null=True, db_column='zona')
    ubigeo = models.ForeignKey('Ubigeo', db_column='ubigeo')

    class Meta:
        managed = True
        db_table = 'PEA'


class PEA_AULA(models.Model):
    id_peaaula = models.AutoField(primary_key=True, db_column='id_peaaula')
    id_pea = models.ForeignKey('PEA', db_column='id_pea')
    id_localambiente = models.ForeignKey('LocalAmbiente', db_column='id_localambiente')

    class Meta:
        managed = True
        db_table = 'PEA_AULA'


class PEA_ASISTENCIA(models.Model):
    id_asistencia = models.AutoField(primary_key=True)
    id_peaaula = models.ForeignKey('PEA_AULA', related_name='peaaulas')
    fecha = models.CharField(max_length=20, blank=True, null=True)
    turno_manana = models.IntegerField(blank=True, null=True)
    turno_tarde = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'PEA_ASISTENCIA'
