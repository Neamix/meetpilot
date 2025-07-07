/**
 * Example Usage of Laravel-style Validation System
 * This file demonstrates how to use the validation system in different scenarios
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from 'react';
import { validateForm, ValidationRules, FormData, ValidationErrors } from './validation';

// Example 1: Basic Login Form Validation
export function validateLoginForm(email: string, password: string) {
  const data: FormData = {
    email,
    password
  };

  const rules: ValidationRules = {
    email: 'required|email',
    password: 'required|min:6'
  };

  const customMessages = {
    'email.required': 'Please enter your email address',
    'email.email': 'Please enter a valid email address',
    'password.required': 'Password is required',
    'password.min': 'Password must be at least 6 characters long'
  };

  return validateForm(data, rules, customMessages);
}

// Example 2: Registration Form with Complex Validation
export function validateRegistrationForm(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  age: number,
  website?: string
) {
  const data: FormData = {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
    age,
    website
  };

  const rules: ValidationRules = {
    name: 'required|min:2|max:50|alpha_dash',
    email: 'required|email',
    password: 'required|min:8|max:100',
    password_confirmation: 'required|same:password',
    age: 'required|integer|min:18|max:120',
    website: 'url' // Optional field, only validated if provided
  };

  const customMessages = {
    'name.required': 'Full name is required',
    'name.min': 'Name must be at least 2 characters',
    'name.max': 'Name cannot exceed 50 characters',
    'name.alpha_dash': 'Name can only contain letters, numbers, dashes, and underscores',
    'email.required': 'Email address is required',
    'email.email': 'Please provide a valid email address',
    'password.required': 'Password is required',
    'password.min': 'Password must be at least 8 characters long',
    'password.max': 'Password cannot exceed 100 characters',
    'password_confirmation.required': 'Please confirm your password',
    'password_confirmation.same': 'Password confirmation does not match',
    'age.required': 'Age is required',
    'age.integer': 'Age must be a valid number',
    'age.min': 'You must be at least 18 years old',
    'age.max': 'Age cannot exceed 120 years',
    'website.url': 'Please enter a valid website URL'
  };

  return validateForm(data, rules, customMessages);
}

// Example 3: Profile Update Form
export function validateProfileForm(
  firstName: string,
  lastName: string,
  bio: string,
  skills: string[],
  experience: string
) {
  const data: FormData = {
    first_name: firstName,
    last_name: lastName,
    bio,
    skills,
    experience
  };
  const rules: ValidationRules = {
    first_name: [
      { rule: 'required', message: 'First name is required' },
      { rule: 'min', value: 2, message: 'First name must be at least 2 characters' },
      { rule: 'max', value: 30, message: 'First name cannot exceed 30 characters' },
      { rule: 'alpha', message: 'First name can only contain letters' }
    ],
    last_name: [
      { rule: 'required', message: 'Last name is required' },
      { rule: 'min', value: 2 },
      { rule: 'max', value: 30 },
      { rule: 'alpha' }
    ],
    bio: [
      { rule: 'max', value: 500, message: 'Bio cannot exceed 500 characters' }
    ],
    skills: [
      { rule: 'required', message: 'Please select at least one skill' },
      { rule: 'array', message: 'Skills must be an array' }
    ],
    experience: [
      { rule: 'required', message: 'Experience level is required' },
      { rule: 'in', value: 'junior,mid,senior,expert', message: 'Please select a valid experience level' }
    ]
  };

  return validateForm(data, rules);
}

// Example 4: Advanced Validation with Custom Rules
export function validateAdvancedForm(formData: any) {
  const rules: ValidationRules = {
    username: 'required|min:3|max:20|alpha_num',
    email: 'required|email',
    phone: 'required|regex:^[+]?[1-9]?[0-9]{7,15}$',
    country: 'required|in:US,CA,UK,AU,DE,FR',
    terms: 'required|boolean',
    newsletter: 'boolean',
    birth_date: 'required|date',
    gender: 'in:male,female,other,prefer_not_to_say'
  };

  const customMessages = {
    'username.required': 'Username is mandatory',
    'username.min': 'Username must be at least 3 characters',
    'username.max': 'Username cannot exceed 20 characters',
    'username.alpha_num': 'Username can only contain letters and numbers',
    'phone.regex': 'Please enter a valid phone number',
    'country.in': 'Please select a valid country',
    'terms.required': 'You must accept the terms and conditions',
    'terms.boolean': 'Terms acceptance must be true or false',
    'birth_date.required': 'Birth date is required',
    'birth_date.date': 'Please enter a valid birth date',
    'gender.in': 'Please select a valid gender option'
  };

  return validateForm(formData, rules, customMessages);
}

// Example 5: Dynamic Validation Rules
export function createDynamicValidation(fields: string[], requiredFields: string[] = []) {
  const rules: ValidationRules = {};
  
  fields.forEach(field => {
    if (requiredFields.includes(field)) {
      rules[field] = 'required';
    }
    
    // Add specific rules based on field name
    if (field.includes('email')) {
      rules[field] = rules[field] ? `${rules[field]}|email` : 'email';
    }
    
    if (field.includes('password')) {
      rules[field] = rules[field] ? `${rules[field]}|min:8` : 'min:8';
    }
    
    if (field.includes('phone')) {
      rules[field] = rules[field] ? `${rules[field]}|regex:^[+]?[1-9]?[0-9]{7,15}$` : 'regex:^[+]?[1-9]?[0-9]{7,15}$';
    }
  });
  
  return rules;
}

// Example 6: React Hook for Form Validation
export function useFormValidation(initialData: FormData, rules: ValidationRules, customMessages = {}) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(() => {
    const result = validateForm(data, rules, customMessages);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, [data, rules, customMessages]);

  const validateField = useCallback((fieldName: string) => {
    const fieldRules: ValidationRules = { [fieldName]: rules[fieldName] };
    const fieldData = { [fieldName]: data[fieldName] };
    const result = validateForm(fieldData, fieldRules, customMessages);
      setErrors((prev: ValidationErrors) => ({
      ...prev,
      [fieldName]: result.errors[fieldName] || []
    }));
    
    return !result.errors[fieldName]?.length;
  }, [data, rules, customMessages]);

  const updateField = useCallback((fieldName: string, value: any) => {    setData((prev: FormData) => ({ ...prev, [fieldName]: value }));
    
    // Clear errors for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev: ValidationErrors) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  return {
    data,
    errors,
    isValid,
    validate,
    validateField,
    updateField,
    setData,
    setErrors
  };
}

// Utility function to format errors for display
export function formatErrorsForDisplay(errors: ValidationErrors): string {
  const allErrors: string[] = [];
  Object.values(errors).forEach(fieldErrors => {
    allErrors.push(...fieldErrors);
  });
  return allErrors.join('\n');
}

// Utility function to get error count
export function getErrorCount(errors: ValidationErrors): number {
  return Object.values(errors).reduce((count, fieldErrors) => count + fieldErrors.length, 0);
}
