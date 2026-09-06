from rest_framework.viewsets import ModelViewSet

from elections.models import Election, Candidate
from elections.serializers import ElectionSerializer, CandidateSerializer


class ElectionViewSet(ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

class CandidatViewSet(ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer