import { useUserData } from '@/hooks/useUserData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UserInfo = () => {
  const { userData, userType, loading, error, userId } = useUserData();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-gray-500">No user data found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Information
          <Badge variant={userType === 'doctor' ? 'default' : 'secondary'}>
            {userType === 'doctor' ? 'Doctor' : 'Patient'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="text-sm text-gray-900 font-mono">{userId}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-sm text-gray-900">{userData.first_name} {userData.last_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-sm text-gray-900">{userData.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Phone</p>
          <p className="text-sm text-gray-900">{userData.phone}</p>
        </div>
        {userType === 'doctor' && 'specialization' in userData && (
          <div>
            <p className="text-sm font-medium text-gray-500">Specialization</p>
            <p className="text-sm text-gray-900">{userData.specialization}</p>
          </div>
        )}
        {userType === 'user' && 'emergency_contact_name' in userData && (
          <div>
            <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
            <p className="text-sm text-gray-900">{userData.emergency_contact_name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInfo; 