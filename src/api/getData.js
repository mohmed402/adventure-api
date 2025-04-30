export default async function getData() {
    try {
      const BASE_URL = "http://localhost:5001";
      const url = new URL(`${BASE_URL}/users/data`);
  
  
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Insert failed");
      }
  
      return result;
    } catch (error) {
      return error.message;
    }
  }
  