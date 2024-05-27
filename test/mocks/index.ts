const mockAdmin : User = {
  id: 1,
  email: 'mock@admin.com',
  password: 'admin',
  name: 'MockAdmin',
  createdAt: new Date(),
  updatedAt: new Date(),
  credit: 50,
  role: Role.OWNER,
  auth: null,
  cars: [],
  parkings: [],
  WardenAssignment: [],
}

const mockUser : User = {
  id: 2,
  email: 'mock@user.com',
  password: 'user',
  name: 'MockUser',
  createdAt: new Date(),
  updatedAt: new Date(),
  credit: 50,
  role: Role.CUSTOMER,
  auth: null,
  cars: [],
  parkings: [],
  WardenAssignment: [],
}

const mockWarden : User = {
  id: 3,
  email: 'mock@warden.com',
  password: 'warden',
  name: 'MockWarden',
  createdAt: new Date(),
  updatedAt: new Date(),
  credit: 50,
  role: Role.WARDEN,
  auth: null,
  cars: [],
  parkings: [],
  WardenAssignment: [],
}

const mockParking : Parking = {
  id: 1,
  name: 'MockParking',
  totalSpaces: 100,
  hourlyPrice: 0.5,
  createdAt: new Date(),
  updatedAt: new Date(),
  parkingAdminId: 1,
  locationId: 1,
  takings: 0,
  parkedCars: [],
  parkingSessions: [],
  parkingAdmin: mockAdmin,
  location: null,
  WardenAssignment: [],
}

const mockLocation = {
  id: 1,
  latitude: 40.712776,
  longitude: -74.005974,
  parking: mockParking,
}

const mockCar : Car = {
  id: 1,
  licencePlate: 'ABC123',
  parkingId: 1,
  userId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  parkedAt: mockParking,
  owner: mockUser,
  parkingSessions: [],
}

const mockWardenAssignment = {
  parkingId: 1,
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
  parking: mockParking,
  user: mockWarden,
}

const mockParkingSession : ParkingSession = {
  id: 1,
  startTime: new Date(),
  endTime: null,
  carId: 1,
  parkingId: 1,
  amount: 0,
  car: mockCar,
  parking: mockParking,
}

export {
  mockAdmin,
  mockUser,
  mockWarden,
  mockParking,
  mockLocation,
  mockCar,
  mockWardenAssignment,
  mockParkingSession,
}
