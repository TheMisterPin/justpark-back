declare global {
enum ValidationTypes {
  email,
  name,
  password
}

interface CustomerInfo {
  id : number
  name: string
  email: string
  cars: CarInfo[]
  credit : number

}
interface WardenInfo{}
interface CarInfo{
  id: number
  licencePlate: string
  parkedAt?: string
  parkingSessions: ParkingSessionInfo[]

}
interface OwnerInfo{
  id: number,
  name : string
  email: string
  parkings: ParkingInfo[]

}
interface ParkingInfo{
id : number
name: string
parkedCars: number

}
interface ParkingSessionInfo{
  id: number
  startTime: Date
  endTime: Date
  parkingName: ParkingInfo['name']
}
}

export {};


