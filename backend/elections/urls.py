from rest_framework.routers import DefaultRouter
from elections.views import ElectionViewSet, CandidatViewSet
router  = DefaultRouter()

router.register(
    "elections",
    ElectionViewSet,
    basename="election"
)

router.register(
    "candidates",
    CandidatViewSet,
    basename="candidate"
)

urlspatterns = router.urls 