from django.db import IntegrityError
from django.db.models import ProtectedError
from django.test import TestCase, override_settings
from django.utils import timezone
from datetime import timedelta
from tempfile import TemporaryDirectory


from academique.models import Faculte, Filiere, Promotion, Departement
from elections.models import Election, Candidate
from etudiants.models import ProfileEtudiant
from elections.tests.tools import create_test_image

from django.contrib.auth import get_user_model


User = get_user_model()


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

class CandidateModelTest(TestCase):

    def setUp(self):
        media_root = TemporaryDirectory()
        self.addCleanup(media_root.cleanup)
        media_settings = override_settings(MEDIA_ROOT=media_root.name)
        media_settings.enable()
        self.addCleanup(media_settings.disable)

        self.user = User(email="student@example.com")
        self.user.set_password("StrongPassword123!")
        self.user.save()

        
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
   
        self.etudiant = ProfileEtudiant.objects.create(
            utilisateur=self.user,
            matricule="78945",
            nom="TEST_NAME",
            post_nom="TEST_POST_NOM",
            prenom="TEST_PRENOM",
            filiere=self.filiere
        )

        self.debut = timezone.now() + timedelta(days=1)
        self.fin = self.debut + timedelta(hours=8)

        self.election = Election.objects.create(
            title="Chef de promotion L2",
            election_type=Election.Type.CP,
            promotion=self.promotion,
            debut=self.debut,
            fin=self.fin
        )

        self.candidate = Candidate.objects.create(
            election=self.election,
            etudiant=self.etudiant,
            image=create_test_image(),
            programme="Améliorer la communication entre les étudiants."
        )

    def test_candidate_creation(self):
        self.assertEqual(
            self.candidate.etudiant,
            self.etudiant
        )

        self.assertEqual(
            self.candidate.election,
            self.election
        )

    def test_candidate_default_status_is_pending(self):
        self.assertEqual(
            self.candidate.statut,
            "PENDING"
        )

    def test_candidate_image_is_saved(self):
        self.candidate.refresh_from_db()

        self.assertEqual(self.candidate.image.name, "candidates/candidate.jpeg")
        self.assertTrue(
            self.candidate.image.storage.exists(self.candidate.image.name)
        )
        with self.candidate.image.open("rb") as saved_image:
            self.assertEqual(saved_image.read(), create_test_image().read())

    def test_candidate_image_is_optional(self):
        self.candidate.image = None
        self.candidate.full_clean()
        self.candidate.save()
        self.candidate.refresh_from_db()

        self.assertFalse(self.candidate.image)

    def test_candidate_programme(self):
        self.assertEqual(
            self.candidate.programme,
            "Améliorer la communication entre les étudiants."
        )

    def test_candidate_string_representation(self):
        expected = f"{self.etudiant} - {self.election}"

        self.assertEqual(
            str(self.candidate),
            expected
        )

    def test_election_can_access_candidates(self):
        self.assertIn(
            self.candidate,
            self.election.candidates.all()
        )

    def test_student_can_access_candidatures(self):
        self.assertIn(
            self.candidate,
            self.etudiant.candidatures.all()
        )

    def test_student_cannot_be_candidate_twice_same_election(self):
        with self.assertRaises(IntegrityError):
            Candidate.objects.create(
                election=self.election,
                etudiant=self.etudiant,
                programme="Deuxième candidature"
            )

    def test_student_can_be_candidate_in_another_election(self):
        another_election = Election.objects.create(
            title="Porte-parole",
            election_type=Election.Type.PORTE_PAROLE,
            debut=self.debut,
            fin=self.fin
        )

        second_candidate = Candidate.objects.create(
            election=another_election,
            etudiant=self.etudiant
        )

        self.assertEqual(
            Candidate.objects.count(),
            2
        )
        second_candidate.refresh_from_db()
        self.assertFalse(second_candidate.image)

    def test_candidate_deleted_when_election_deleted(self):
        candidate_id = self.candidate.id

        self.election.delete()

        self.assertFalse(
            Candidate.objects.filter(id=candidate_id).exists()
        )

    def test_student_cannot_be_deleted_if_candidate(self):
        with self.assertRaises(ProtectedError):
            self.etudiant.delete()

    def test_candidate_can_be_approved(self):
        self.candidate.statut = "APPROVED"
        self.candidate.save()

        self.candidate.refresh_from_db()

        self.assertEqual(
            self.candidate.statut,
            "APPROVED"
        )


    def test_candidate_can_be_rejected(self):
        self.candidate.statut = "REJECTED"
        self.candidate.save()

        self.candidate.refresh_from_db()

        self.assertEqual(
            self.candidate.statut,
            "REJECTED"
        )
