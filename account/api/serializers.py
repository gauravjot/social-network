from rest_framework import serializers
from account.models import Person, Token

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'first_name','last_name','password','email','avatar','birthday','tagline', 'created', 'updated','slug']
        extra_kwargs = {
            'password': {'write_only':True},
            'email': {'write_only':True},
            'created': {'required':False},
            'updated': {'required':False},
            'slug': {'required':False},
        }

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['account', 'token','created']
        extra_kwargs = {
            'created': {'required':False},
        }