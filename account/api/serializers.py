from rest_framework import serializers
from account.models import Person

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'first_name','last_name','password','email','avatar','birthday','tagline']
        extra_kwargs = {
            'password': {'write_only':True},
            'email': {'write_only':True}
        }