interface SignUpData {
    name: string;
    email: string;
    password: string;
  }
  
  // Function to handle the sign up process
  export const signUp = async (data: SignUpData): Promise<void> => {
    console.log("Sending data to the server:", data); // Log data being sent to the server

    try {
      const response = await fetch('api/signup', { // This should point to your backend API endpoint for registration
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Failed to sign up.');
      }
  
      const result = await response.json();
      console.log('Registration successful:', result);
      // Actions post-registration can be handled here
    } catch (error: any) {
      console.error('Error during registration:', error.message || 'An unknown error occurred');
    }
  };
  