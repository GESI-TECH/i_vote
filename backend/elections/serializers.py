from rest_framework import serializers
from elections.models import Election, Candidate

class ElectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Election
        fields = "__all__"

    def validate(self, attrs):
        election_type = attrs.get("election_type")
        promotion = attrs.get("promotion")
        faculte = attrs.get("faculte")

        # Porte-parole
        if election_type == Election.Type.PORTE_PAROLE:
            if faculte or promotion:
                raise serializers.ValidationError(
                    "L'élection du porte-parole concerne toute l'université."
                )

        # Président facultaire
        elif election_type == Election.Type.PREFAC:
            if not faculte:
                raise serializers.ValidationError({
                    "faculty": "La faculté est obligatoire."
                })

            if promotion:
                raise serializers.ValidationError(
                    "Une élection PREFAC ne peut pas cibler "
                    "une promotion ou des filières."
                )

        # Chef de promotion
        elif election_type == Election.Type.CP:

            if not promotion:
                raise serializers.ValidationError(
                    "Sélectionnez une promotion."
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
            student_faculte = etudiant.faculte

            if student_faculte != election.faculte:
                raise serializers.ValidationError(
                    "Cet étudiant n'appartient pas à la faculté "
                    "concernée par cette élection."
                )

        # Chef de promotion
        elif election.election_type == Election.Type.CP:

            if etudiant.promotion != election.promotion:
                raise serializers.ValidationError(
                    "Cet étudiant n'appartient pas à la promotion "
                    "concernée par cette élection."
                )

        return attrs
