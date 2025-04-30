export function validateForm(formData, isSignUp) {
    const { name, email, password } = formData;
    const errors = {};
  
    if (isSignUp && (!name || name.trim().length < 2)) {
      errors.name = 'Please enter a valid name.';
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
  
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
  
    return errors;
  }
  