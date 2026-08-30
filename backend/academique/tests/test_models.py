from django.db import IntegrityError
from django.test import TestCase

from academique.models import Faculte, Departement, Promotion, Filiere


class FaculteModelTest(TestCase):

    def setUp(self):
        self.faculte = Faculte.objects.create(
            nom = "Faculté des sciences et technologies appliqués",
            code = "FSTA"
        )

    def test_faculte_creation(self):
        self.assertEqual(self.faculte.nom,
                         "Faculté des sciences et technologies appliqués"
                         )
        self.assertEqual(self.faculte.code, "FSTA")

    def test_faculte_string_representation(self):
        self.assertEqual(
            str(self.faculte),
            "FSTA : Faculté des sciences et technologies appliqués"
        )

    def test_unique_faculte_code(self):
        with self.assertRaises(IntegrityError):
            Faculte.objects.create(
                nom = "Autre",
                code = "FSTA"
            )

    def test_unique_faculte_name(self):
        with self.assertRaises(IntegrityError):
            Faculte.objects.create(
                nom = "Faculté des sciences et technologies appliqués",
                code = "AUTRE"
            )

class DepartementModelTest(TestCase):
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

    def test_departement_creation(self):
        self.assertEqual(
            self.departement.nom,
            "Science de l'ingénieur"
        )

        self.assertEqual(
            self.departement.code,
            "D-SI-01"
        )

    def test_departement_associe_faclute(self):
        self.assertEqual(
            self.departement.faculte,
            self.faculte
        )

    def test_faculte_access_filiere(self):
        self.assertIn(
            self.departement,
            self.faculte.departements.all()
        )

    def test_unique_departement_nom(self):
        with self.assertRaises(IntegrityError):
            Departement.objects.create(
            nom = "Science de l'ingénieur",
            code= "D-SI-01",
            faculte = self.faculte
            )

    def test_unique_departement_code(self):
        with self.assertRaises(IntegrityError):
                Departement.objects.create(
                nom = "Autre departement",
                code= "D-SI-01",
                faculte = self.faculte
            )

    def test_string_representation(self):
        self.assertEqual(
            str(self.departement),
            "D-SI-01 : Science de l'ingénieur - Faculté des sciences et technologies appliqués"
        )