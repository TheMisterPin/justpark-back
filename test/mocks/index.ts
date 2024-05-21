
// const mockAdmin = {
//   credit: 50,
//   email: process.env.TEST_EMAIL as string,
//   id: 1,
//   name: process.env.TEST_NAME,
//   password: process.env.TEST_PASSWORD as string,
//   role: 'OWNER'
// }
const mockAdmin = {
  credit: 50,
  email: 'mock@admin.com',
  id: 1,
  name: 'MockAdmin',
  password: 'admin',
  role: 'OWNER'
}

const mockParking ={

        "id": 1,
        "name": "parking3",
        "location": "city",
        "totalSpaces": 100,
        "hourlyPrice": 0.5,
        "parkingAdminId": 4,
        "takings": 0
    }

    export { mockAdmin, mockParking }