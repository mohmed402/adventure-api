import React, { useState } from 'react';
// import styles from  '../styles/authForm.module.css'; // assuming your styles are saved here
import styles from  '../styles/EditCustomerModal.module.css'; // assuming your styles are saved here
import { validateForm } from '../utils/validateForm'; // adjust path if needed
import { authRequest } from '../api/authApi';
import { supabase } from '../supabaseClient';



function AuthForm ({ onClose, onSubmit, loggedIn, setName}) {
    const [isSignUp, setIsSignUp] = useState(true);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    });

    const handleChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const validationErrors = validateForm(formData, isSignUp);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    
      setErrors({});
    
      const response = await authRequest(formData, isSignUp ? 'signup' : 'signin');
    
      if (response.success) {
        const { data: { user } } = await supabase.auth.getUser(); // ✅ Fetch the authenticated user
    
        if (user) {
          loggedIn(true);
    
          // ✅ Now fetch name directly from user_metadata
          setName(user.user_metadata?.name || ''); 
        }
    
        onClose(); // Close the modal
      } else {
        setErrors({ general: response.error });
      }
    };
    
    
    
      
      

    return (
        <section className={styles.modalOverlay}>
        <section className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            
            {isSignUp && (
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Name</label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
      
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            {errors.general && (
  <p className={styles.errorText} style={{ marginTop: '10px', textAlign: 'center' }}>
    {errors.general}
  </p>
)}

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>
                {isSignUp ? 'Create Account' : 'Log In'}
              </button>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
      
          </form>
      
          <p style={{ marginTop: '16px', color: '#8a8f98', fontSize: '13px' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              style={{ color: '#e6e6e6', cursor: 'pointer' }}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({}); // reset errors when switching modes
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
      
        </section>
      </section>
      
    );

};


export default AuthForm

