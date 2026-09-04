from django.db import models


class Election(models.Model):

    class Type(models.TextChoices):
        PORTE_PAROLE = "PORTE_PAROLE", "Porte-parole"
        PREFAC = "PREFAC", "Président facultaire"
        CP = "CP", "Chef de promotion"

    title = models.CharField(max_length=255)

    election_type = models.CharField(
        max_length=30,
        choices=Type.choices
    )

    faculte = models.ForeignKey(
        "academique.Faculte",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="elections"
    )

    promotion = models.ForeignKey(
        "academique.Promotion",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="elections"
    )

    filieres = models.ManyToManyField(
        "academique.Filiere",
        blank=True,
        related_name="elections"
    )

    debut = models.DateTimeField()
    fin = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title