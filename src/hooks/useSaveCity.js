export async function saveCityData({ name, mainImage, images = [], places = [], raw = {} }) {
  console.log("📦 saveCityData input:", { name, mainImage, images, places, raw });

  if (!name || images.length === 0 || places.length === 0) {
    console.warn("❌ Missing required fields. Skipping save.");
    return;
  }

  try {
    const res = await fetch("https://adventure-api-production.up.railway.app/city/saveCity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        mainImage,
        images,
        places,
        raw,
      }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to save city data");

    console.log("✅ City data saved successfully");
  } catch (err) {
    console.error("❌ Error saving city:", err.message);
  }
}
