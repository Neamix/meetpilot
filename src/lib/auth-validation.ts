/**
 * Practical Implementation Example for Authentication Forms
 * This shows how to integrate the validation system with your existing auth component
 */

import { useState } from 'react';
import { validateForm, ValidationRules, FormData, ValidationErrors, getFirstError, hasError } from './validation';

// Auth Form Validation Functions
export const authValidationRules = {
  // Login form validation
  login: {
    email: 'required|email',
    password: 'required|min:6'
  } as ValidationRules,

  // Registration form validation
  register: {
    name: 'required|min:2|max:50|alpha_dash',
    email: 'required|email',
    password: 'required|min:8|max:100',
    password_confirmation: 'required|same:password'
  } as ValidationRules,

  // Password reset validation
  passwordReset: {
    email: 'required|email'
  } as ValidationRules,

  // Password update validation
  passwordUpdate: {
    current_password: 'required|min:6',
    password: 'required|min:8|max:100',
    password_confirmation: 'required|same:password'
  } as ValidationRules
};

// Custom error messages for auth forms
export const authValidationMessages = {
  // Login messages
  'email.required': 'Please enter your email address',
  'email.email': 'Please enter a valid email address',
  'password.required': 'Please enter your password',

  // Registration messages
  'name.required': 'Full name is required',
  'name.min': 'Name must be at least 2 characters',
  'name.max': 'Name cannot exceed 50 characters',
  'name.alpha_dash': 'Name can only contain letters, numbers, dashes, and underscores',
  'password.min': 'Password must be at least 8 characters for security',
  'password.max': 'Password cannot exceed 100 characters',
  'password_confirmation.required': 'Please confirm your password',
  'password_confirmation.same': 'Password confirmation does not match',

  // Password reset messages
  'current_password.required': 'Please enter your current password',
  'current_password.min': 'Current password must be at least 6 characters'
};

// Login Form Validation Hook
export function useLoginValidation() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateLogin = () => {
    const result = validateForm(formData, authValidationRules.login, authValidationMessages);
    setErrors(result.errors);
    return result.isValid;
  };

  const updateField = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear field error when user starts typing
    if (hasError(errors, fieldName)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (onSubmit: (data: FormData) => Promise<void>) => {
    if (!validateLogin()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      setErrors({ general: ['An error occurred during login'] });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateLogin,
    handleSubmit,
    getFieldError: (field: string) => getFirstError(errors, field),
    hasFieldError: (field: string) => hasError(errors, field)
  };
}

// Registration Form Validation Hook
export function useRegistrationValidation() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRegistration = () => {
    const result = validateForm(formData, authValidationRules.register, authValidationMessages);
    setErrors(result.errors);
    return result.isValid;
  };

  const updateField = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear field error when user starts typing
    if (hasError(errors, fieldName)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (onSubmit: (data: FormData) => Promise<void>) => {
    if (!validateRegistration()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      setErrors({ general: ['An error occurred during registration'] });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateRegistration,
    handleSubmit,
    getFieldError: (field: string) => getFirstError(errors, field),
    hasFieldError: (field: string) => hasError(errors, field)
  };
}

// Individual field validation functions for real-time validation
export function validateEmailField(email: string): string | null {
  const result = validateForm({ email }, { email: 'required|email' }, authValidationMessages);
  return getFirstError(result.errors, 'email');
}

export function validatePasswordField(password: string): string | null {
  const result = validateForm({ password }, { password: 'required|min:8' }, authValidationMessages);
  return getFirstError(result.errors, 'password');
}

export function validateNameField(name: string): string | null {
  const result = validateForm({ name }, { name: 'required|min:2|max:50|alpha_dash' }, authValidationMessages);
  return getFirstError(result.errors, 'name');
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  const result = validateForm(
    { password, password_confirmation: confirmation },
    { password_confirmation: 'required|same:password' },
    authValidationMessages
  );
  return getFirstError(result.errors, 'password_confirmation');
}

// Form validation for different auth scenarios
export function validateLoginCredentials(email: string, password: string) {
  return validateForm(
    { email, password },
    authValidationRules.login,
    authValidationMessages
  );
}

export function validateRegistrationData(name: string, email: string, password: string, passwordConfirmation: string) {
  return validateForm(
    {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    },
    authValidationRules.register,
    authValidationMessages
  );
}

export function validatePasswordResetEmail(email: string) {
  return validateForm(
    { email },
    authValidationRules.passwordReset,
    authValidationMessages
  );
}

// Utility functions for error handling in components
export function getFormattedErrors(errors: ValidationErrors): string[] {
  const allErrors: string[] = [];
  Object.values(errors).forEach(fieldErrors => {
    allErrors.push(...fieldErrors);
  });
  return allErrors;
}

export function hasAnyErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getFieldErrorClass(errors: ValidationErrors, fieldName: string, baseClass: string = ''): string {
  const errorClass = hasError(errors, fieldName) ? 'border-red-500 focus:border-red-500' : '';
  return `${baseClass} ${errorClass}`.trim();
}

// Advanced validation for complex scenarios
export function validateComplexPassword(password: string): { isValid: boolean; errors: string[] } {
  const complexRules: ValidationRules = {
    password: [
      { rule: 'required', message: 'Password is required' },
      { rule: 'min', value: 8, message: 'Password must be at least 8 characters long' },
      { rule: 'regex', value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$', message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' }
    ]
  };

  const result = validateForm({ password }, complexRules);
  return {
    isValid: result.isValid,
    errors: result.errors.password || []
  };
}

// Business logic validation (can be extended)
export function validateBusinessRules(formData: FormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // Example: Check if email domain is allowed
  if (formData.email) {
    const blockedDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    
    if (blockedDomains.includes(emailDomain)) {
      errors.email = ['This email domain is not allowed. Please use a different email address.'];
    }
  }

  // Example: Password complexity based on user type
  if (formData.password && formData.user_type === 'admin') {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    if (!hasSpecialChar) {
      errors.password = ['Admin passwords must contain at least one special character.'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
