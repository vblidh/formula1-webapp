const baseUrl = import.meta.env.VITE_BASEURL
const headers = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json'
})
const useFetch = {
  fetchData: async function (endpoint, params) {
    const url = `${baseUrl}${endpoint}?${new URLSearchParams(params)}`
    const resp = await fetch(url, { headers })
    const data = await resp.json()
    return data
  }
}

export default useFetch
