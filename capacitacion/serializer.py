from .models import *
from rest_framework import routers, serializers, viewsets
from login.models import User


class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = '__all__'


class MarcoLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarcoLocal
        fields = '__all__'


class UsuarioLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioLocal
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class DirectorioLocalSerializer(serializers.ModelSerializer):
    usuarios = UserSerializer(many=True, read_only=True)

    class Meta:
        model = DirectorioLocal
        fields = '__all__'


class LocalAulasSerializer(serializers.ModelSerializer):
    ambientes = AmbienteSerializer(many=True, read_only=True)

    class Meta:
        model = Local
        fields = '__all__'


class LocalAmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalAmbiente
        fields = '__all__'


class PEA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PEA
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class CriterioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterio
        fields = '__all__'


class CursoCriterioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCriterio
        fields = '__all__'


class TipoFuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionario
        fields = '__all__'


class PEASerializer(serializers.ModelSerializer):
    id_cargofuncional = TipoFuncionarioSerializer()

    class Meta:
        model = PEA
        fields = '__all__'


class PEA_BY_AULASerializer(serializers.ModelSerializer):
    pea = PEASerializer(many=True, read_only=True)

    class Meta:
        model = LocalAmbiente
        fields = '__all__'


class PEA_ASISTENCIASerializer(serializers.ModelSerializer):
    class Meta:
        model = PEA_ASISTENCIA
        fields = '__all__'


class PEA_CURSOCRITERIOSerializer(serializers.ModelSerializer):
    class Meta:
        model = PEA_CURSOCRITERIO
        fields = '__all__'


class PEA_AULASerializer(serializers.ModelSerializer):
    peaaulas = PEA_ASISTENCIASerializer(many=True, read_only=True)
    id_pea = PEASerializer()

    class Meta:
        model = PEA_AULA
        fields = '__all__'


class PeaNotaFinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeaNotaFinal
        fields = '__all__'
