from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Aircraft, Flight, Booking

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'company_name']
    list_filter = ['role', 'is_staff', 'is_superuser']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'company_name')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'company_name')}),
    )

@admin.register(Aircraft)
class AircraftAdmin(admin.ModelAdmin):
    list_display = ['model', 'capacity', 'company', 'created_at']
    list_filter = ['company']
    search_fields = ['model', 'company__company_name']

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ['flight_number', 'departure_airport', 'arrival_airport', 'departure_time', 'company']
    list_filter = ['company', 'departure_time']
    search_fields = ['flight_number', 'departure_airport', 'arrival_airport']
    date_hierarchy = 'departure_time'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['passenger', 'flight', 'seat_number', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['passenger__email', 'flight__flight_number', 'seat_number']
    date_hierarchy = 'created_at'
