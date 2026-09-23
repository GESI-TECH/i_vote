from django.contrib import admin
from elections.models import Election, Candidate

admin.site.register(Election)
admin.site.register(Candidate)