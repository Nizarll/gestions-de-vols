from django.core.management.base import BaseCommand
from django.utils import timezone
from flights.models import User, Aircraft, Flight, Booking

class Command(BaseCommand):
    help = "Seed database with sample airline data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        Booking.objects.all().delete()
        Flight.objects.all().delete()
        Aircraft.objects.all().delete()
        User.objects.all().delete()

        company = User.objects.create_user(
            username="airmaroc@gmail.com",
            password="test1234",
            role="company",
            company_name="Air Morocco"
        )

        passenger = User.objects.create_user(
            username="nizar",
            password="test1234",
            first_name="Nizar",
            last_name="Dev",
            role="user"
        )

        aircraft = Aircraft.objects.create(
            company=company,
            model="Boeing 737",
            capacity=180
        )

        flight1 = Flight.objects.create(
            company=company,
            aircraft=aircraft,
            flight_number="AT123",
            departure_airport="Casablanca",
            arrival_airport="Paris",
            image="https://cdn.pixabay.com/photo/2024/11/30/15/55/eiffel-tower-9235220_1280.jpg",
            departure_time=timezone.now(),
            arrival_time=timezone.now(),
        )

        flight2 = Flight.objects.create(
            company=company,
            aircraft=aircraft,
            flight_number="AT456",
            departure_airport="Rabat",
            image="https://www.esmadrid.com/sites/default/files/styles/content_type_full/public/editorial/AustriasPalacioReal_1395308287.048.jpg?itok=qKDU9J2A",
            arrival_airport="Madrid",
            departure_time=timezone.now(),
            arrival_time=timezone.now(),
        )

        Booking.objects.create(
            flight=flight1,
            passenger=passenger,
            seat_number="12A"
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
