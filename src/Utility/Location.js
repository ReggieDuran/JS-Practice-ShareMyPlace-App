const GOOGLE_API_KEY = 'AIzaSyAAH6wqJzEyPGp4JdNma0_SzwKyUGKSipw';

export async function getCoordsFromAddress(address) {
    const urlAddress = encodeURI(address);
    const response = await fetch(`
        https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`,
    );
    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Please try again!');
    }
    
    const data = await response.json();
    if (data.error_message) {
        throw new Error(data.error_message);
    }
console.log(data)
    const coordinates = data.results[0].geometry.location;
    return coordinates;
}