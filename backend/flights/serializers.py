from rest_framework import serializers
from .models import User, Aircraft, Flight, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'company_name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'role', 'company_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'user'),
            company_name=validated_data.get('company_name', '')
        )
        return user

class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = ['id', 'model', 'capacity', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'company_name']

class FlightSerializer(serializers.ModelSerializer):
    aircraft = AircraftSerializer(read_only=True)
    aircraft_id = serializers.PrimaryKeyRelatedField(
        queryset=Aircraft.objects.all(), source='aircraft', write_only=True
    )
    company = CompanySerializer(read_only=True)
    available_seats = serializers.ReadOnlyField()

    class Meta:
        model = Flight
        fields = [
            'id', 'flight_number', 'image', 'departure_airport', 'arrival_airport',
            'departure_time', 'arrival_time', 'aircraft', 'aircraft_id',
            'company', 'available_seats', 'captain_id', 'first_officer_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'company']

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class BookingSerializer(serializers.ModelSerializer):
    flight = FlightSerializer(read_only=True)
    flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(), source='flight', write_only=True
    )
    passenger = PassengerSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'flight', 'flight_id', 'passenger', 'seat_number', 'status', 'created_at']
        read_only_fields = ['id', 'passenger', 'created_at']

    def validate(self, data):
        flight = data.get('flight')
        seat_number = data.get('seat_number')

        # Check if seat is already taken
        if Booking.objects.filter(flight=flight, seat_number=seat_number, status='confirmed').exists():
            raise serializers.ValidationError("This seat is already booked.")

        # Check if flight has available seats
        if flight.available_seats <= 0:
            raise serializers.ValidationError("No seats available on this flight.")

        return data
