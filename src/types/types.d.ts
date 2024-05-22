declare global {
  enum ValidationTypes {
    email,
    name,
    password,
  }

  interface CustomerInfo {
    id: number
    name: string
    email: string
    cars: CarInfo[]
    credit: number
  }

  interface WardenInfo {
    id: number
    name: string
    email: string
    parkings: ParkingInfo[]
  }

  interface CarInfo {
    id: number
    licencePlate: string
    parkedAt?: string
    parkingSessions: ParkingSessionInfo[]
  }

  interface OwnerInfo {
    id: number
    name: string
    email: string
    parkings: ParkingInfo[]
  }

  interface ParkingInfo {
    id: number
    name: string
    parkedCars: number
  }

  interface ParkingSessionInfo {
    id: number
    startTime: Date
    endTime: Date
    parkingName: ParkingInfo['name']
  }

  // New Interfaces for Extended Functionality
  interface Auth {
    id: number
    sessionToken?: string
    passwordToken?: string
    createdAt: Date
    updatedAt: Date
    userId: number
    user: User
  }

  interface Location {
    id: number
    latitude: number
    longitude: number
    parking?: Parking
  }

  interface Parking {
    id: number
    name: string
    totalSpaces: number
    hourlyPrice: number
    createdAt: Date
    updatedAt: Date
    parkingAdminId: number
    locationId: number
    takings: number
    parkedCars: Car[]
    parkingSessions: ParkingSession[]
    parkingAdmin: User
    location: Location
    WardenAssignment: WardenAssignment[]
  }

  interface Car {
    id: number
    licencePlate: string
    parkingId?: number
    userId: number
    createdAt: Date
    updatedAt: Date
    parkedAt?: Parking
    owner: User
    parkingSessions: ParkingSession[]
  }

  interface User {
    id: number
    email: string
    password: string
    name: string
    createdAt: Date
    updatedAt: Date
    credit: number
    role: Role
    auth?: Auth
    cars: Car[]
    parkings: Parking[]
    WardenAssignment: WardenAssignment[]
  }

  interface WardenAssignment {
    parkingId: number
    userId: number
    createdAt: Date
    updatedAt: Date
    parking: Parking
    user: User
  }

  interface ParkingSession {
    id: number
    startTime: Date
    endTime?: Date
    carId: number
    parkingId: number
    amount: number
    car: Car
    parking: Parking
  }

  enum Role {
    OWNER,
    WARDEN,
    CUSTOMER,
  }
}

export {}
