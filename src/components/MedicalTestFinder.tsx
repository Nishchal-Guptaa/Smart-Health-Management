import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { MapPin, Phone, Clock, Star, Home, Shield } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  radius_km: number;
  test_category?: string;
  test_name?: string;
  max_price?: number;
  home_collection?: boolean;
  insurance_accepted?: boolean;
}

interface TestCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  operating_hours: string;
  is_24_hours: boolean;
  accepts_insurance: boolean;
  home_collection_available: boolean;
  rating: number;
  total_reviews: number;
  distance_km?: number;
}

interface MedicalTest {
  id: string;
  name: string;
  description: string;
  category: string;
  preparation_instructions: string;
  fasting_required: boolean;
  fasting_hours: number;
  report_delivery_hours: number;
}

interface CenterTest {
  center: TestCenter;
  test: MedicalTest;
  price: number;
  discount_price?: number;
  is_available: boolean;
}

interface NearbyTestResponse {
  tests: CenterTest[];
  total_count: number;
  search_radius_km: number;
  user_location: { latitude: number; longitude: number };
}

interface TestCategory {
  category: string;
  test_count: number;
}

const MedicalTestFinder: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 28.6139,
    longitude: 77.2090,
    radius_km: 10.0,
  });
  const [results, setResults] = useState<CenterTest[]>([]);
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const API_BASE = 'http://localhost:8000';

  useEffect(() => {
    fetchCategories();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/medical-tests/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchNearbyTests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/medical-tests/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      if (response.ok) {
        const data: NearbyTestResponse = await response.json();
        setResults(data.tests);
      } else {
        setError('Failed to fetch nearby tests');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'N/A';
    return `${distance.toFixed(1)} km`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Medical Tests Near You
        </h1>
        <p className="text-gray-600">
          Discover medical test centers and book tests at the best prices
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                placeholder="28.6139"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                placeholder="77.2090"
              />
            </div>
            <div>
              <Label htmlFor="radius">Radius (km)</Label>
              <Input
                id="radius"
                type="number"
                value={location.radius_km}
                onChange={(e) => setLocation(prev => ({ ...prev, radius_km: parseFloat(e.target.value) }))}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="category">Test Category</Label>
              <Select
                value={location.test_category || ''}
                onValueChange={(value) => setLocation(prev => ({ ...prev, test_category: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category} ({cat.test_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxPrice">Max Price (₹)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={location.max_price || ''}
                onChange={(e) => setLocation(prev => ({ ...prev, max_price: e.target.value ? parseFloat(e.target.value) : undefined }))}
                placeholder="No limit"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="homeCollection"
                checked={location.home_collection || false}
                onChange={(e) => setLocation(prev => ({ ...prev, home_collection: e.target.checked }))}
              />
              <Label htmlFor="homeCollection">Home Collection Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="insurance"
                checked={location.insurance_accepted || false}
                onChange={(e) => setLocation(prev => ({ ...prev, insurance_accepted: e.target.checked }))}
              />
              <Label htmlFor="insurance">Insurance Accepted</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={searchNearbyTests} disabled={loading}>
              {loading ? 'Searching...' : 'Search Nearby Tests'}
            </Button>
            {userLocation && (
              <Button variant="outline" onClick={getUserLocation}>
                Use My Location
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Found {results.length} tests near you
            </h2>
            <Badge variant="secondary">
              Within {location.radius_km}km radius
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.map((item, index) => (
              <Card key={`${item.center.id}-${item.test.id}-${index}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.test.name}</CardTitle>
                      <p className="text-sm text-gray-600">{item.center.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(item.price)}
                      </div>
                      {item.discount_price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(item.discount_price)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{item.center.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{item.center.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{item.center.operating_hours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{item.center.rating}/5 ({item.center.total_reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Distance: {formatDistance(item.center.distance_km)}</span>
                  </div>

                  <div className="flex gap-2">
                    {item.center.home_collection_available && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Home Collection
                      </Badge>
                    )}
                    {item.center.accepts_insurance && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Insurance
                      </Badge>
                    )}
                    <Badge variant="secondary">{item.test.category}</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Preparation:</strong> {item.test.preparation_instructions}
                  </div>

                  <Button className="w-full">Book This Test</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">
              No tests found. Try adjusting your search criteria or increasing the search radius.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalTestFinder; 