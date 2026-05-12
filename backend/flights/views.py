from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate
from .models import User, Aircraft, Flight, Booking
from .serializers import (
    UserSerializer, RegisterSerializer, AircraftSerializer,
    FlightSerializer, BookingSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
                'companyName': user.company_name if user.role == 'company' else None
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
                'companyName': user.company_name if user.role == 'company' else None
            }
        })
    return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'role': user.role,
        'companyName': user.company_name if user.role == 'company' else None
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh = request.data.get('refresh')
    if not refresh:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh_token = RefreshToken(refresh)
        return Response({
            'token': str(refresh_token.access_token),
            'refresh': str(refresh_token)
        })
    except TokenError as e:
        return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh = request.data.get('refresh')
        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class AircraftViewSet(viewsets.ModelViewSet):
    serializer_class = AircraftSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'company':
            return Aircraft.objects.filter(company=user)
        return Aircraft.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'company':
            raise permissions.PermissionDenied("Only companies can create aircraft")
        serializer.save(company=self.request.user)

    @action(detail=False, methods=['get'])
    def my(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class FlightViewSet(viewsets.ModelViewSet):
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'company':
            return Flight.objects.filter(company=user)
        return Flight.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role != 'company':
            raise permissions.PermissionDenied("Only companies can create flights")

        aircraft = serializer.validated_data.get('aircraft')
        if aircraft.company != self.request.user:
            raise permissions.PermissionDenied("You can only use your own aircraft")

        serializer.save(company=self.request.user)

    def perform_update(self, serializer):
        flight = self.get_object()
        if flight.company != self.request.user:
            raise permissions.PermissionDenied("You can only update your own flights")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.company != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own flights")
        instance.delete()

    @action(detail=False, methods=['get'])
    def my(self, request):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can access this endpoint'},
                          status=status.HTTP_403_FORBIDDEN)
        queryset = Flight.objects.filter(company=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def passengers(self, request, pk=None):
        flight = self.get_object()
        if request.user.role == 'company' and flight.company != request.user:
            raise permissions.PermissionDenied("You can only view passengers of your own flights")

        bookings = Booking.objects.filter(flight=flight, status='confirmed')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'user':
            return Booking.objects.filter(passenger=user)
        elif user.role == 'company':
            return Booking.objects.filter(flight__company=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'user':
            raise permissions.PermissionDenied("Only passengers can create bookings")
        serializer.save(passenger=self.request.user)

    def perform_destroy(self, instance):
        if instance.passenger != self.request.user:
            raise permissions.PermissionDenied("You can only cancel your own bookings")
        instance.status = 'cancelled'
        instance.save()

    @action(detail=False, methods=['get'])
    def my(self, request):
        if request.user.role != 'user':
            return Response({'error': 'Only passengers can access this endpoint'},
                          status=status.HTTP_403_FORBIDDEN)
        queryset = Booking.objects.filter(passenger=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-flights')
    def my_flights(self, request):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can access this endpoint'},
                          status=status.HTTP_403_FORBIDDEN)
        queryset = Booking.objects.filter(flight__company=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
