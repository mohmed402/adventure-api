// frontend/hooks/useCheckedCity.js
export async function getCheckedCity(cityName) {
    console.log("the city im searching is ", cityName)
    const res = await fetch(`http://localhost:5001/cityCheck/check/${encodeURIComponent(cityName)}`);
    const data = await res.json();
    console.log("this is the data returnd: ", data)
    if (!res.ok) throw new Error(data.error || 'Failed to load city');
    console.log("[getCheckedCity] Source:", data.source);
    return data;
  }
  