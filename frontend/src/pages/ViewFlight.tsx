import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { flightAPI } from '../services/api';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const geocode = async (place) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );

  const data = await response.json();

  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};

const FitBounds = ({ from_pos, to_pos }) => {
  const map_instance = useMap();

  useEffect(() => {
    if (!from_pos || !to_pos) return;

    const bounds = L.latLngBounds([from_pos, to_pos]);

    map_instance.fitBounds(bounds, {
      padding: [100, 100],
    });
  }, [from_pos, to_pos, map_instance]);

  return null;
};

const BezierCurve = ({ from_pos, to_pos }) => {
  const map_instance = useMap();

  useEffect(() => {
    if (!from_pos || !to_pos) return;

    const start_point = L.latLng(from_pos);
    const end_point = L.latLng(to_pos);

    const control_point = L.latLng(
      (start_point.lat + end_point.lat) / 2 +
        (end_point.lng - start_point.lng) * 0.3,
      (start_point.lng + end_point.lng) / 2 -
        (end_point.lat - start_point.lat) * 0.3
    );

    const curve_steps = 80;
    const curve_points = [];

    for (let progress = 0; progress <= 1; progress += 1 / curve_steps) {
      const lat =
        (1 - progress) * (1 - progress) * start_point.lat +
        2 * (1 - progress) * progress * control_point.lat +
        progress * progress * end_point.lat;

      const lng =
        (1 - progress) * (1 - progress) * start_point.lng +
        2 * (1 - progress) * progress * control_point.lng +
        progress * progress * end_point.lng;

      curve_points.push([lat, lng]);
    }

    const curve_line = L.polyline(curve_points, {
      color: 'blue',
      weight: 3,
    }).addTo(map_instance);

    return () => {
      map_instance.removeLayer(curve_line);
    };
  }, [from_pos, to_pos, map_instance]);

  return null;
};

const FlightMap = ({ from, to }) => {
  const [from_pos, set_from_pos] = useState(null);
  const [to_pos, set_to_pos] = useState(null);

  useEffect(() => {
    const load_positions = async () => {
      const departure_position = await geocode(from);
      const arrival_position = await geocode(to);

      set_from_pos(departure_position);
      set_to_pos(arrival_position);
    };

    load_positions();
  }, [from, to]);

  if (!from_pos || !to_pos) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer
      center={from_pos}
      zoom={4}
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '12px',
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds
        from_pos={from_pos}
        to_pos={to_pos}
      />

      <BezierCurve
        from_pos={from_pos}
        to_pos={to_pos}
      />

      <Marker position={from_pos} />
      <Marker position={to_pos} />
    </MapContainer>
  );
};

const ViewFlight = () => {
  const { id } = useParams();

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [flight, set_flight] = useState(null);

  const handle_logout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const load_flight = async () => {
      try {
        const response = await flightAPI.getOne(id);

        set_flight(response.data);
      } catch (error) {
      }
    };

    load_flight();
  }, [id]);

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading flight...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      <header className="fixed top-0 z-50 w-full h-16 flex justify-between items-center px-6 bg-white border-b border-gray-200">

        <div className="font-bold text-blue-600 text-xl">
          Dashboard
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user.firstName} {user.lastName}
          </span>

          <button
            onClick={handle_logout}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        <main className="flex-1 p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Flight {flight.flight_number}
            </h2>

            <p className="text-gray-600 mt-1">
              {flight.departure_airport} → {flight.arrival_airport}
            </p>
          </div>

          <div className="mb-6">
            <FlightMap
              from={flight.departure_airport}
              to={flight.arrival_airport}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Flight Details
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">
                    Company:
                  </span>{' '}
                  {flight.company.company_name}
                </div>

                <div>
                  <span className="font-medium">
                    Aircraft:
                  </span>{' '}
                  {flight.aircraft.model}
                </div>

                <div>
                  <span className="font-medium">
                    Capacity:
                  </span>{' '}
                  {flight.aircraft.capacity}
                </div>

                <div>
                  <span className="font-medium">
                    Available Seats:
                  </span>{' '}
                  {flight.available_seats}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Schedule
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">
                    Departure:
                  </span>{' '}
                  {new Date(flight.departure_time).toLocaleString()}
                </div>

                <div>
                  <span className="font-medium">
                    Arrival:
                  </span>{' '}
                  {new Date(flight.arrival_time).toLocaleString()}
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default ViewFlight;
