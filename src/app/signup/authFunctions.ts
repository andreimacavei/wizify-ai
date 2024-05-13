interface SignUpData {
    name: string;
    email: string;
    details: string;
  }
  
  // Function to handle the sign up process
  export const signUp = async (data) => {
    console.log("Sending data to the server:", data); // Log data being sent to the server
  
    try {
      const response = await fetch('api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.status === 201) {
        console.log('Registration successful:', result);
        return { success: true };
      } else {
        console.error('Failed to sign up:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error during registration:', error.message || 'An unknown error occurred');
      return { success: false, error: error.message };
    }
  };