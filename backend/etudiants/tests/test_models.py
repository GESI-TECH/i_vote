from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from django.test import TestCase

from academique.models import Faculte, Departement, Promotion, Filiere
from etudiants.models import ProfileEtudiant


User = get_user_model()


class StudentProfileModelTest(TestCase):

    def setUp(self):
        self.user = User(email="student@example.com")
        self.user.set_password("StrongPassword123!")
        self.user.save()

        self.faculte = Faculte.objects.create(
            nom="Faculté des Sciences et Technologies Appliquées",
            code="FSTA"
        )

        self.departement = Departement.objects.create(
            nom = "Sciences de l'ingénieur",
            code = "D-SI",
            faculte = self.faculte
        )

        self.promotion = Promotion.objects.create(
            nom = "Licence 2",
            code = "L2",
            departement = self.departement
        )

        self.filiere = Filiere.objects.create(
            nom="Génie Informatique",
            code="F-GI",
            promotion = self.promotion
        )

        self.etudiant = ProfileEtudiant.objects.create(
            utilisateur = self.user,
            matricule = "23598",
            nom = "MBULINYOLO",
            post_nom = "MALIYASASA",
            prenom = "EDDY",
            filiere = self.filiere
        )

    def test_profile_etudiant_creation(self):
        self.assertEqual(self.etudiant.matricule, "23598")
        self.assertEqual(self.etudiant.nom, "MBULINYOLO")
        self.assertEqual(self.etudiant.post_nom, "MALIYASASA")
        self.assertEqual(self.etudiant.prenom, "EDDY")
        self.assertIsNotNone(self.etudiant.created_at)
        self.assertIsNotNone(self.etudiant.updated_at)

    def test_profile_associe_utilisateur(self):
        self.assertEqual(self.etudiant.utilisateur, self.user)

    def test_utilisateur_access_profile_etudiant(self):
        self.assertEqual(self.user.profile_etudiant, self.etudiant)

    def test_profile_associe_filiere(self):
        self.assertEqual(self.etudiant.filiere, self.filiere)

    def test_filiere_access_etudiants(self):
        self.assertIn(self.etudiant, self.filiere.etudiants.all())

    def test_profile_access_parcours_academique(self):
        self.assertEqual(
            self.etudiant.filiere.promotion.departement.faculte,
            self.faculte
        )

    def test_matricule_unique(self):
        autre_utilisateur = User(email="autre@example.com")
        autre_utilisateur.set_password("StrongPassword123!")
        autre_utilisateur.save()

        with self.assertRaises(IntegrityError):
            ProfileEtudiant.objects.create(
                utilisateur=autre_utilisateur,
                matricule="23598",
                nom="AUTRE",
                post_nom="ETUDIANT",
                prenom="TEST",
                filiere=self.filiere
            )

    def test_un_utilisateur_ne_peut_avoir_qu_un_profile_etudiant(self):
        with self.assertRaises(IntegrityError):
            ProfileEtudiant.objects.create(
                utilisateur=self.user,
                matricule="99999",
                nom="AUTRE",
                post_nom="ETUDIANT",
                prenom="TEST",
                filiere=self.filiere
            )

    def test_suppression_utilisateur_supprime_profile_etudiant(self):
        profile_id = self.etudiant.pk

        self.user.delete()

        self.assertFalse(
            ProfileEtudiant.objects.filter(pk=profile_id).exists()
        )

    def test_suppression_filiere_protegee_si_etudiant_associe(self):
        with self.assertRaises(ProtectedError):
            self.filiere.delete()

    def test_string_representation(self):
        self.assertEqual(
            str(self.etudiant),
            "23598 - MBULINYOLO - EDDY"
        )
