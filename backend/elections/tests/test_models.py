from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from academique.models import Faculte, Filiere, Promotion, Departement
from elections.models import Election


class ElectionModelTest(TestCase):

    def setUp(self):
        self.faculte = Faculte.objects.create(
                nom = "Faculté des sciences et technologies appliqués",
                code = "FSTA"
            )
        self.departement = Departement.objects.create(
            nom = "Science de l'ingénieur",
            code= "D-SI-01",
            faculte = self.faculte
        )

        self.promotion = Promotion.objects.create(
            nom = "Licence 1",
            code = "L1",
            departement = self.departement
        )

        self.filiere_1 = Filiere.objects.create(
            nom = "Génie informatique",
            code = "GI",
            promotion = self.promotion
        )

        self.filiere_2 = Filiere.objects.create(
            nom = "Génie Mecanique",
            code = "GM",
            promotion = self.promotion
        )

        self.start = timezone.now() + timedelta(days=1)
        self.end = self.start + timedelta(hours=8)

    def test_create_prefac_election(self):
        election = Election.objects.create(
            title="Élection du président FSTA",
            election_type=Election.Type.PREFAC,
            faculte=self.faculte,
            debut=self.start,
            fin=self.end
        )

        self.assertEqual(
            election.election_type,
            Election.Type.PREFAC
        )

        self.assertEqual(
            election.faculte,
            self.faculte
        )

        self.assertIsNone(election.promotion)

    def test_create_cp_for_promotion(self):
        election = Election.objects.create(
            title="Élection chef L2 Génie Informatique",
            election_type=Election.Type.CP,
            promotion=self.promotion,
            debut=self.start,
            fin=self.end
        )

        self.assertEqual(
            election.election_type,
            Election.Type.CP
        )

        self.assertEqual(
            election.promotion,
            self.promotion
        )

        self.assertEqual(
            election.filieres.count(),
            0
        )

    def test_string_representation(self):
        election = Election.objects.create(
            title="Élection du porte-parole",
            election_type=Election.Type.PORTE_PAROLE,
            debut=self.start,
            fin=self.end
        )

        self.assertEqual(
            str(election),
            "Élection du porte-parole"
        )

    def test_election_types(self):
        self.assertEqual(
            Election.Type.PORTE_PAROLE,
            "PORTE_PAROLE"
        )

        self.assertEqual(
            Election.Type.PREFAC,
            "PREFAC"
        )

        self.assertEqual(
            Election.Type.CP,
            "CP"
        )