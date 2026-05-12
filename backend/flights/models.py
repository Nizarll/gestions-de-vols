from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'Passenger'),
        ('company', 'Company'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    company_name = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        if self.role == 'company': return f"{self.company_name}"
        return f"{self.first_name} {self.last_name}"


class Aircraft(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='aircrafts')
    model = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model} ({self.capacity} seats)"

    class Meta:
        ordering = ['-created_at']


class Flight(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flights')
    aircraft = models.ForeignKey(Aircraft, on_delete=models.PROTECT, related_name='flights')

    flight_number = models.CharField(max_length=20)
    departure_airport = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    captain_id = models.IntegerField(blank=True, null=True)
    first_officer_id = models.IntegerField(blank=True, null=True)
    image = models.CharField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.flight_number}: {self.departure_airport} → {self.arrival_airport}"

    @property
    def available_seats(self):
        booked = self.bookings.filter(status='confirmed').count()
        return self.aircraft.capacity - booked

    class Meta:
        ordering = ['departure_time']


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings')
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    seat_number = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.passenger} - {self.flight.flight_number} - Seat {self.seat_number}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ['flight', 'seat_number']
