from django.db import models
from django.conf import settings

class ProfileEtudiant(models.Model):

    utilisateur = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name = "profile_etudiant")
    
    matricule = models.CharField(max_length=100, unique=True)

    nom = models.CharField(max_length=50)
    post_nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)

    filiere = models.ForeignKey(
        "academique.Filiere",
        on_delete=models.PROTECT,
        related_name="etudiants"
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.matricule} - {self.nom} - {self.prenom}"
