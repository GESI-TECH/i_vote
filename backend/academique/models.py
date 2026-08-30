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

class Departement(models.Model):
    nom = models.CharField(
        max_length = 100, 
        unique = True
        )
    code = models.CharField(
        max_length = 10, 
        unique = True
        )
    faculte = models.ForeignKey(
        "Faculte",
        on_delete=models.PROTECT,
        related_name="departements"
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} : {self.nom} - {self.faculte.nom}"

class Promotion(models.Model):

    nom = models.CharField(max_length=100,unique=True)
    code = models.CharField(max_length=10, unique=True)
    departement = models.ForeignKey(
        "Departement",
        on_delete=models.PROTECT,
        related_name="promotions"
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
            return f"{self.code} : {self.nom} - {self.departement.nom}"

class Filiere(models.Model):
    nom = models.CharField(
        max_length = 100, 
        unique = True
        )
    code = models.CharField(
        max_length = 10, 
        unique = True
        )
    promotion = models.ForeignKey(
        "Promotion",
        on_delete=models.CASCADE,
        related_name="filieres"
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} : {self.nom}-{self.promotion.nom}"
    


