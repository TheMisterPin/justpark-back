import axios from 'axios'

const API_KEY = process.env.GOOGLE_API_KEY
const { BASE_URL } = process.env

async function getCoordinates(address: string) {
  const url = `${BASE_URL}${encodeURIComponent(address)}&key=${API_KEY}`
  const response = await axios.get(url)

  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Invalid address')
  }

  const { location } = response.data.results[0].geometry

  return location
}

export default getCoordinates
