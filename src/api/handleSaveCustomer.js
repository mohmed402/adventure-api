export async function handleSaveCustomer(id, updatedCustomer) {
    try {
        const BASE_URL = "adventure-api-production.up.railway.app";
        const url = new URL(`${BASE_URL}/users/${id}`);
      const response = await fetch(`${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to update customer");
      }
      console.log("✅ Customer updated:", result);

      // 👉 After successful save:

      return result; 
    } catch (error) {
      console.error("❌ Update error:", error.message);
      throw error; 
    }
  }
  