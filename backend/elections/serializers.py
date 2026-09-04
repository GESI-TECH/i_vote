from rest_framework import serializers
from elections.models import Election, Candidate

class ElectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Election
        fields = "__all__"

    def validate(self, attrs):
        election_type = attrs.get("election_type")
        promotion = attrs.get("promotion")
        filieres = attrs.get("filieres", [])
        faculte = attrs.get("faculte")

        # Porte-parole
        if election_type == Election.Type.PORTE_PAROLE:
            if faculte or promotion or filieres:
                raise serializers.ValidationError(
                    "L'élection du porte-parole concerne toute l'université."
                )

        # Président facultaire
        elif election_type == Election.Type.PREFAC:
            if not faculte:
                raise serializers.ValidationError({
                    "faculty": "La faculté est obligatoire."
                })

            if promotion or filieres:
                raise serializers.ValidationError(
                    "Une élection PREFAC ne peut pas cibler "
                    "une promotion ou des filières."
                )

        # Chef de promotion
        elif election_type == Election.Type.CP:

            # Promotion + filières interdit
            if promotion and filieres:
                raise serializers.ValidationError(
                    "Vous ne pouvez pas sélectionner une promotion "
                    "et des filières en même temps."
                )

            # Aucun des deux
            if not promotion and not filieres:
                raise serializers.ValidationError(
                    "Sélectionnez soit une promotion, "
                    "soit au moins une filière."
                )

        return attrs

class CandidateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Candidate
        fields = "__all__"

    def validate(self, attrs):
        election = attrs.get("election")
        etudiant = attrs.get("etudiant")

        if not election or not etudiant:
            return attrs

        # Porte-parole
        if election.election_type == Election.Type.PORTE_PAROLE:
            return attrs

        # Président facultaire
        if election.election_type == Election.Type.PREFAC:
            student_faculte = (
                etudiant.filiere.promotion.departement.faculte
            )

            if student_faculte != election.faculte:
                raise serializers.ValidationError(
                    "Cet étudiant n'appartient pas à la faculté "
                    "concernée par cette élection."
                )

        # Chef de promotion
        elif election.election_type == Election.Type.CP:

            # Élection liée à une promotion précise
            if election.promotion:
                if etudiant.filiere.promotion != election.promotion:
                    raise serializers.ValidationError(
                        "Cet étudiant n'appartient pas à la promotion "
                        "concernée par cette élection."
                    )

            # Élection liée à plusieurs filières
            elif election.filieres.exists():
                student_filiere = etudiant.filiere

                if not election.filieres.filter(
                    id=student_filiere.id
                ).exists():
                    raise serializers.ValidationError(
                        "Cet étudiant n'appartient à aucune des filières "
                        "concernées par cette élection."
                    )

        return attrs