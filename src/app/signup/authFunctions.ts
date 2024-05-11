interface SignUpData {
    name: string;
    email: string;
    details: string;
  }
  
  // Function to handle the sign up process
  export const signUp = async (data: SignUpData): Promise<boolean> => {
    console.log("Sending data to the server:", data); // Log data being sent to the server

    try {
      const response = await fetch('api/signup', { // This should point to your backend API endpoint for registration
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });


    if (response.status === 201) {
        const result = await response.json();
        console.log('Registration successful:', result);
        return true; 
    } else {
        console.error('Failed to sign up:', response.status);
        return false;
    }
 
  } catch (error) {
    console.error('Error during registration:', error.message || 'An unknown error occurred');
    return false; 
  }

  };
  