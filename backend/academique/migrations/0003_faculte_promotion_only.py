from django.db import migrations, models
import django.db.models.deletion


def copy_academic_links(apps, schema_editor):
    Faculte = apps.get_model("academique", "Faculte")
    Promotion = apps.get_model("academique", "Promotion")
    ProfileEtudiant = apps.get_model("etudiants", "ProfileEtudiant")

    for promotion in Promotion.objects.select_related("departement"):
        promotion.faculte_id = promotion.departement.faculte_id
        promotion.save(update_fields=["faculte"])

    for student in ProfileEtudiant.objects.select_related(
        "filiere__promotion__departement"
    ):
        promotion = student.filiere.promotion
        student.promotion_id = promotion.pk
        student.faculte_id = promotion.departement.faculte_id
        student.save(update_fields=["promotion", "faculte"])


class Migration(migrations.Migration):
    dependencies = [
        ("academique", "0002_alter_promotion_code_alter_promotion_nom_and_more"),
        ("etudiants", "0001_initial"),
        ("elections", "0003_candidate_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="promotion",
            name="faculte",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="promotions",
                to="academique.faculte",
            ),
        ),
        migrations.AddField(
            model_name="profileetudiant",
            name="faculte",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="etudiants",
                to="academique.faculte",
            ),
        ),
        migrations.AddField(
            model_name="profileetudiant",
            name="promotion",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="etudiants",
                to="academique.promotion",
            ),
        ),
        migrations.RemoveConstraint(
            model_name="promotion",
            name="unique_promotion_per_departement",
        ),
        migrations.RunPython(copy_academic_links, migrations.RunPython.noop),
        migrations.RemoveField(model_name="profileetudiant", name="filiere"),
        migrations.RemoveField(model_name="election", name="filieres"),
        migrations.RemoveField(model_name="promotion", name="departement"),
        migrations.DeleteModel(name="filiere"),
        migrations.DeleteModel(name="departement"),
        migrations.AlterField(
            model_name="promotion",
            name="faculte",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="promotions",
                to="academique.faculte",
            ),
        ),
        migrations.AlterField(
            model_name="profileetudiant",
            name="faculte",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="etudiants",
                to="academique.faculte",
            ),
        ),
        migrations.AlterField(
            model_name="profileetudiant",
            name="promotion",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="etudiants",
                to="academique.promotion",
            ),
        ),
        migrations.AddConstraint(
            model_name="promotion",
            constraint=models.UniqueConstraint(
                fields=("nom", "faculte"),
                name="unique_promotion_per_faculte",
            ),
        ),
    ]
