from django.contrib import admin
from account.models import Person, Token

# Register your models here.
admin.site.register(Person)
admin.site.register(Token)