import axios from 'axios';

// Helper to check if API is ready
async function waitForAPI(url: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(`${url}/api/health`);
      if (response.status === 200) return true;
    } catch (e) {
      console.log(`Waiting for API... (attempt ${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

export default async () => {
  const apiURL = process.env['API_URL'] || 'http://localhost:3000';
  // Ensure API is available before running tests
  if (!await waitForAPI(apiURL)) {
    throw new Error('API failed to start');
  }
};