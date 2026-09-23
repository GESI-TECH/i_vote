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


class PromotionModelTest(TestCase):
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

    def test_promotion_creation(self):
        self.assertEqual(
            self.promotion.nom,
            "Licence 1"
        )

        self.assertEqual(
            self.promotion.code,
            "L1"
        )

    def test_promotion_associe_departement(self):
        self.assertEqual(
            self.promotion.departement,
            self.departement
        )

    def test_promotion_associe_faculte(self):
            self.assertEqual(
                self.promotion.departement.faculte,
                self.faculte
            )

    def test_departement_access_promotion(self):
        self.assertIn(
            self.promotion,
            self.departement.promotions.all()
        )

    def test_unique_promotion_nom(self):
        with self.assertRaises(IntegrityError):
            Promotion.objects.create(
                nom = "Licence 1",
                code= "AUTRE",
                departement = self.departement
            )

    def test_unique_promotion_code(self):
        with self.assertRaises(IntegrityError):
            Promotion.objects.create(
                nom = "Autre nom",
                code= "L1",
                departement = self.departement
            )

    def test_string_representation(self):
        self.assertEqual(
            str(self.promotion),
            "L1 : Licence 1 - Science de l'ingénieur"
        )

class FiliereModelTest(TestCase):
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

        self.filiere = Filiere.objects.create(
            nom = "Génie informatique",
            code = "GI",
            promotion = self.promotion
        )

    def test_filiere_creation(self):
        self.assertEqual(
            self.filiere.nom,
            "Génie informatique"
        )

        self.assertEqual(
            self.filiere.code,
            "GI"
        )

    def test_filiere_associe_promotion(self):
        self.assertEqual(
            self.filiere.promotion,
            self.promotion
        )

    def test_filiere_associe_departement_et_faculte(self):
        self.assertEqual(
            self.filiere.promotion.departement,
            self.departement
        )
        self.assertEqual(
            self.filiere.promotion.departement.faculte,
            self.faculte
        )

    def test_promotion_access_filiere(self):
        self.assertIn(
            self.filiere,
            self.promotion.filieres.all()
        )

    def test_unique_filiere_nom(self):
        with self.assertRaises(IntegrityError):
            Filiere.objects.create(
                nom = "Génie informatique",
                code= "AUTRE",
                promotion = self.promotion
            )

    def test_unique_filiere_code(self):
        with self.assertRaises(IntegrityError):
            Filiere.objects.create(
                nom = "Autre nom",
                code= "GI",
                promotion = self.promotion
            )

    def test_string_representation(self):
        self.assertEqual(
            str(self.filiere),
            "GI : Génie informatique - Licence 1"
        )
