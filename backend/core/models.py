from django.db import models
from comptes.models import User
from academic_structure import ACADEMIC_STRUCTURE

FACULTY_CHOICES = [(data["code"],faculty) for faculty, data in ACADEMIC_STRUCTURE.values()]
PROMOTION_CHOICES = sorted({
    (promotion, promotion)
    for data in ACADEMIC_STRUCTURE.values()
    for promotion in data["promotions"]
})

class ProfileEtudiant(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    matricule = models.IntegerField(unique=True)
    nom = models.CharField(max_length=20)
    postnom = models.CharField(max_length=20)
    prenom = models.CharField(max_length=20)
    faculte = models.CharField(max_length=50, choices=FACULTY_CHOICES)
    promotion = models.CharField(max_length=50, choices=PROMOTION_CHOICES)

    def __str__(self):
        return f"{self.nom} {self.postnom} {self.prenom} - {self.matricule}"

