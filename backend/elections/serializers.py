from rest_framework import serializers

from elections.models import Election


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