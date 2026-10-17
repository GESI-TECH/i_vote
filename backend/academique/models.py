from django.db import models

class Faculte(models.Model):

    nom = models.CharField(
        max_length=100, 
        unique=True
        )
    code = models.CharField(
        max_length=10, 
        unique=True
        )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} : {self.nom}"

class Promotion(models.Model):
    nom = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    faculte = models.ForeignKey(
        "Faculte",
        on_delete=models.PROTECT,
        related_name="promotions"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["nom", "faculte"],
                name="unique_promotion_per_faculte"
            )
        ]
    def __str__(self):
            return f"{self.code} : {self.nom} - {self.faculte.nom}"


