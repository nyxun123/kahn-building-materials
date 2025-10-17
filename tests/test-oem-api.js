// Test script for OEM API functionality
const testData = {
  title: "Test OEM Service",
  description: "Test OEM service description",
  features: ["Feature 1", "Feature 2", "Feature 3"],
  process: [
    { step: 1, title: "Step 1", description: "First step" },
    { step: 2, title: "Step 2", description: "Second step" }
  ],
  capabilities: ["Capability 1", "Capability 2"],
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  seo_title: "Test SEO Title",
  seo_description: "Test SEO Description",
  seo_keywords: "test, oem, keywords",
  status: "published"
};

async function testOEMAPI() {
  console.log("Testing OEM API functionality...\n");
  
  // Test GET request
  console.log("1. Testing GET /api/admin/oem");
  try {
    const getResponse = await fetch('http://localhost:8788/api/admin/oem', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer admin-session'
      }
    });
    console.log(`   GET Status: ${getResponse.status}`);
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log("   GET Response:", JSON.stringify(getData, null, 2));
    } else {
      console.error("   GET Error:", await getResponse.text());
    }
  } catch (error) {
    console.error("   GET Request failed:", error.message);
  }
  
  // Test PUT request
  console.log("\n2. Testing PUT /api/admin/oem");
  try {
    const putResponse = await fetch('http://localhost:8788/api/admin/oem', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-session'
      },
      body: JSON.stringify(testData)
    });
    console.log(`   PUT Status: ${putResponse.status}`);
    if (putResponse.ok) {
      const putData = await putResponse.json();
      console.log("   PUT Response:", JSON.stringify(putData, null, 2));
    } else {
      console.error("   PUT Error:", await putResponse.text());
    }
  } catch (error) {
    console.error("   PUT Request failed:", error.message);
  }
  
  console.log("\nTest completed.");
}

// Run the test
testOEMAPI().catch(console.error);