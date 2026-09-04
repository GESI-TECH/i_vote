from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from academique.models import (
    Faculte,
    Departement,
    Promotion,
    Filiere,
)

from etudiants.models import ProfileEtudiant
from elections.models import Election
from elections.serializers import CandidateSerializer


User = get_user_model()


class CandidateSerializerTest(TestCase):

    def setUp(self):

        self.debut = timezone.now() + timedelta(days=1)
        self.fin = self.debut + timedelta(hours=8)

        self.faculte_sciences = Faculte.objects.create(
            nom="Faculté des Sciences",
            code="FSC"
        )

        self.departement_info = Departement.objects.create(
            nom="Département Informatique",
            code="INFO",
            faculte=self.faculte_sciences
        )

        self.promotion_l2_info = Promotion.objects.create(
            nom="Deuxième année Informatique",
            code="L2INFO",
            departement=self.departement_info
        )

        self.filiere_genie_info = Filiere.objects.create(
            nom="Génie Informatique",
            code="GI",
            promotion=self.promotion_l2_info
        )

        # Deuxième filière de la même promotion
        self.filiere_reseaux = Filiere.objects.create(
            nom="Réseaux",
            code="RES",
            promotion=self.promotion_l2_info
        )

        self.faculte_droit = Faculte.objects.create(
            nom="Faculté de Droit",
            code="DRT"
        )

        self.departement_droit = Departement.objects.create(
            nom="Département de Droit",
            code="DD",
            faculte=self.faculte_droit
        )

        self.promotion_l2_droit = Promotion.objects.create(
            nom="Deuxième année Droit",
            code="L2DRT",
            departement=self.departement_droit
        )

        self.filiere_droit_prive = Filiere.objects.create(
            nom="Droit Privé",
            code="DPR",
            promotion=self.promotion_l2_droit
        )

        self.user_info = User(email="info@example.com",password="Password123!")
        self.user_info.save()

        self.user_reseaux = User(email="reseaux@example.com",password="Password123!")
        self.user_reseaux.save()

        self.user_droit = User(email="droit@example.com",password="Password123!")
        self.user_droit.save()

        self.etudiant_info = ProfileEtudiant.objects.create(
            user=self.user_info,
            matricule="INFO001",
            filiere=self.filiere_genie_info
        )

        self.etudiant_reseaux = ProfileEtudiant.objects.create(
            user=self.user_reseaux,
            matricule="INFO002",
            filiere=self.filiere_reseaux
        )

        self.etudiant_droit = ProfileEtudiant.objects.create(
            user=self.user_droit,
            matricule="DRT001",
            filiere=self.filiere_droit_prive
        )

    def test_porte_parole_candidate_valide(self):

        election = Election.objects.create(
            title="Élection Porte-parole",
            election_type=Election.Type.PORTE_PAROLE,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_droit.id,
            "programme": "Représenter tous les étudiants."
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_prefac_candidate_same_faculte_valide(self):

        election = Election.objects.create(
            title="Président Faculté des Sciences",
            election_type=Election.Type.PREFAC,
            faculte=self.faculte_sciences,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_info.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_prefac_candidate_other_faculte_invalide(self):

        election = Election.objects.create(
            title="Président Faculté des Sciences",
            election_type=Election.Type.PREFAC,
            faculte=self.faculte_sciences,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_droit.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "Cet étudiant n'appartient pas à la faculté "
            "concernée par cette élection."
        )

    def test_cp_candidate_same_promotion_valide(self):

        election = Election.objects.create(
            title="Chef de promotion L2 Informatique",
            election_type=Election.Type.CP,
            promotion=self.promotion_l2_info,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_info.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_cp_candidate_other_promotion_invalide(self):

        election = Election.objects.create(
            title="Chef de promotion L2 Informatique",
            election_type=Election.Type.CP,
            promotion=self.promotion_l2_info,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_droit.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "Cet étudiant n'appartient pas à la promotion "
            "concernée par cette élection."
        )

    def test_cp_candidate_selected_filiere_valide(self):

        election = Election.objects.create(
            title="Élection CP filières informatiques",
            election_type=Election.Type.CP,
            debut=self.debut,
            fin=self.fin
        )

        election.filieres.add(
            self.filiere_genie_info,
            self.filiere_reseaux
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_info.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

    def test_cp_candidate_second_selected_filiere_valide(self):

        election = Election.objects.create(
            title="Élection CP filières informatiques",
            election_type=Election.Type.CP,
            debut=self.debut,
            fin=self.fin
        )

        election.filieres.add(
            self.filiere_genie_info,
            self.filiere_reseaux
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_reseaux.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )
    

    def test_cp_candidate_not_in_selected_filieres_invalide(self):

        election = Election.objects.create(
            title="Élection CP filières informatiques",
            election_type=Election.Type.CP,
            debut=self.debut,
            fin=self.fin
        )

        election.filieres.add(
            self.filiere_genie_info,
            self.filiere_reseaux
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_droit.id
        }

        serializer = CandidateSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn(
            "non_field_errors",
            serializer.errors
        )

        self.assertEqual(
            str(serializer.errors["non_field_errors"][0]),
            "Cet étudiant n'appartient à aucune des filières "
            "concernées par cette élection."
        )

    def test_serializer_creates_candidate(self):

        election = Election.objects.create(
            title="Élection Porte-parole",
            election_type=Election.Type.PORTE_PAROLE,
            debut=self.debut,
            fin=self.fin
        )

        data = {
            "election": election.id,
            "etudiant": self.etudiant_info.id,
            "programme": "Améliorer la représentation étudiante."
        }

        serializer = CandidateSerializer(data=data)

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors
        )

        candidate = serializer.save()

        self.assertEqual(
            candidate.election,
            election
        )

        self.assertEqual(
            candidate.etudiant,
            self.etudiant_info
        )

        self.assertEqual(
            candidate.programme,
            "Améliorer la représentation étudiante."
        )

        self.assertEqual(
            candidate.statut,
            "PENDING"
        )