import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Demo mode
        if (values.email === 'demo@test.com' && values.password === 'password') {
          localStorage.setItem('token', 'demo-token');
          localStorage.setItem('user', JSON.stringify({
            id: 1, name: 'Demo User', email: 'demo@test.com', role: 'patient'
          }));
          navigate('/');
        } else {
          const result = await login(values.email, values.password);
          if (result.success) {
            navigate('/');
          } else {
            setErrors({ submit: result.error });
          }
        }
      } catch (error) {
        setErrors({ submit: error.message });
      }
      setSubmitting(false);
    }
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
          
          {formik.errors.submit && <div className="error-message">{formik.errors.submit}</div>}
          
          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{color: 'red', fontSize: '0.9rem', marginTop: '5px'}}>{formik.errors.email}</div>
              ) : null}
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{color: 'red', fontSize: '0.9rem', marginTop: '5px'}}>{formik.errors.password}</div>
              ) : null}
            </div>
            
            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="login-btn"
            >
              {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="demo-credentials">
            Demo credentials: demo@test.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;