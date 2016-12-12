from rest_framework import routers
from views import *

router = routers.DefaultRouter()
router.register(r'local', LocalViewSet)
router.register(r'ambiente', AmbienteViewSet)
router.register(r'criterio', CriteriosViewSet)
router.register(r'localambiente', LocalAmbienteViewSet)
router.register(r'criterio', CriteriosViewSet)
router.register(r'cursocriterios', CursoCriteriosViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'pea_aula', PEA_BY_AULAViewSet)
router.register(r'pea_asistencia', PEA_ASISTENCIAViewSet)
#router.register(r'peaaulaasistencia', PEA_AULAViewSet)
