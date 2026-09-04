from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from academique.models import Faculte, Filiere, Promotion, Departement
from elections.models import Election
from elections.serializers import ElectionSerializer


class ElectionSerializerTest(TestCase):

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



        self.debut = timezone.now() + timedelta(days=1)
        self.fin = self.debut + timedelta(hours=8)

    def test_porte_parole_avec_faculte_invalide(self):
        data = {
            "title": "Élection porte-parole",
            "election_type": Election.Type.PORTE_PAROLE,
            "faculte": self.faculte.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

    def test_porte_parole_avec_faculte_message_erreur(self):
        data = {
            "title": "Élection porte-parole",
            "election_type": Election.Type.PORTE_PAROLE,
            "faculte": self.faculte.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "L'élection du porte-parole concerne toute l'université."
        )

    def test_prefac_valide(self):
        data = {
            "title": "Élection président facultaire",
            "election_type": Election.Type.PREFAC,
            "faculte": self.faculte.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_prefac_sans_faculte_invalide(self):
        data = {
            "title": "Élection président facultaire",
            "election_type": Election.Type.PREFAC,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "faculty",
            serializer.errors
        )

    def test_prefac_avec_promotion_invalide(self):
        data = {
            "title": "Élection président facultaire",
            "election_type": Election.Type.PREFAC,
            "faculte": self.faculte.id,
            "promotion": self.promotion.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

    def test_cp_avec_promotion_valide(self):
        data = {
            "title": "Élection chef de promotion",
            "election_type": Election.Type.CP,
            "promotion": self.promotion.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_cp_avec_plusieurs_filieres_valide(self):
        data = {
            "title": "Élection chefs de promotion",
            "election_type": Election.Type.CP,
            "filieres": [
                self.filiere_1.id,
                self.filiere_2.id,
            ],
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_cp_avec_promotion_et_filieres_invalide(self):
        data = {
            "title": "Élection chef de promotion",
            "election_type": Election.Type.CP,
            "promotion": self.promotion.id,
            "filieres": [
                self.filiere_1.id
            ],
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "Vous ne pouvez pas sélectionner une promotion "
            "et des filières en même temps."
        )

    def test_cp_sans_promotion_ni_filiere_invalide(self):
        data = {
            "title": "Élection chef de promotion",
            "election_type": Election.Type.CP,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "Sélectionnez soit une promotion, "
            "soit au moins une filière."
        )

    def test_serializer_cree_election_prefac(self):
        data = {
            "title": "Président facultaire FSTA",
            "election_type": Election.Type.PREFAC,
            "faculte": self.faculte.id,
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

        election = serializer.save()

        self.assertEqual(
            Election.objects.count(),
            1
        )

        self.assertEqual(
            election.faculte,
            self.faculte
        )

        self.assertEqual(
            election.election_type,
            Election.Type.PREFAC
        )

    def test_serializer_enregistre_plusieurs_filieres(self):
        data = {
            "title": "Élection CP",
            "election_type": Election.Type.CP,
            "filieres": [
                self.filiere_1.id,
                self.filiere_2.id
            ],
            "debut": self.debut,
            "fin": self.fin,
        }

        serializer = ElectionSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

        election = serializer.save()

        self.assertEqual(
            election.filieres.count(),
            2
        )