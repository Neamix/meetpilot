/**
 * Laravel-style Form Validation System
 * 
 * Features:
 * - Multiple validation rules per field
 * - Customizable error messages
 * - Array-based error return format
 * - Built-in validation rules: required, email, min, max, confirmed, etc.
 * - Easy to extend with custom rules
 */

// Types for validation system
export interface ValidationRule {
  rule: string;
  value?: any;
  message?: string;
}

export interface ValidationErrors {
  [fieldName: string]: string[];
}

export interface ValidationRules {
  [fieldName: string]: string | ValidationRule[];
}

export interface FormData {
  [key: string]: any;
}

// Default error messages (Laravel-style)
const DEFAULT_MESSAGES = {
  required: 'The :field field is required.',
  email: 'The :field must be a valid email address.',
  min: 'The :field must be at least :min characters.',
  max: 'The :field may not be greater than :max characters.',
  numeric: 'The :field must be a number.',
  integer: 'The :field must be an integer.',
  confirmed: 'The :field confirmation does not match.',
  url: 'The :field format is invalid.',
  alpha: 'The :field may only contain letters.',
  alpha_num: 'The :field may only contain letters and numbers.',
  alpha_dash: 'The :field may only contain letters, numbers, dashes and underscores.',
  between: 'The :field must be between :min and :max characters.',
  in: 'The selected :field is invalid.',
  not_in: 'The selected :field is invalid.',
  regex: 'The :field format is invalid.',
  same: 'The :field and :other must match.',
  different: 'The :field and :other must be different.',
  unique: 'The :field has already been taken.',
  exists: 'The selected :field is invalid.',
  date: 'The :field is not a valid date.',
  date_format: 'The :field does not match the format :format.',
  before: 'The :field must be a date before :date.',
  after: 'The :field must be a date after :date.',
  boolean: 'The :field field must be true or false.',
  array: 'The :field must be an array.',
  string: 'The :field must be a string.',
};

/**
 * Main Validator Class
 */
export class Validator {
  private data: FormData;
  private rules: ValidationRules;
  private customMessages: { [key: string]: string };
  private errors: ValidationErrors = {};

  constructor(
    data: FormData, 
    rules: ValidationRules, 
    customMessages: { [key: string]: string } = {}
  ) {
    this.data = data;
    this.rules = rules;
    this.customMessages = customMessages;
  }

  /**
   * Validate all fields and return validation result
   */
  public validate(): { isValid: boolean; errors: ValidationErrors } {
    this.errors = {};

    for (const fieldName in this.rules) {
      const fieldRules = this.parseRules(this.rules[fieldName]);
      const fieldValue = this.data[fieldName];

      this.validateField(fieldName, fieldValue, fieldRules);
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors
    };
  }

  /**
   * Parse rules from string or array format
   */
  private parseRules(rules: string | ValidationRule[]): ValidationRule[] {
    if (Array.isArray(rules)) {
      return rules;
    }

    return rules.split('|').map(rule => {
      const [ruleName, ...params] = rule.split(':');
      const value = params.length > 0 ? params.join(':') : undefined;
      
      return {
        rule: ruleName,
        value: value
      };
    });
  }

  /**
   * Validate a single field with its rules
   */
  private validateField(fieldName: string, fieldValue: any, rules: ValidationRule[]) {
    for (const ruleObj of rules) {
      const { rule, value, message } = ruleObj;
      
      if (!this.applyRule(fieldName, fieldValue, rule, value)) {
        this.addError(fieldName, this.getErrorMessage(fieldName, rule, value, message));
      }
    }
  }

  /**
   * Apply a validation rule to a field
   */
  private applyRule(fieldName: string, fieldValue: any, rule: string, ruleValue?: any): boolean {
    switch (rule) {
      case 'required':
        return this.validateRequired(fieldValue);
      
      case 'email':
        return this.validateEmail(fieldValue);
      
      case 'min':
        return this.validateMin(fieldValue, parseInt(ruleValue));
      
      case 'max':
        return this.validateMax(fieldValue, parseInt(ruleValue));
      
      case 'numeric':
        return this.validateNumeric(fieldValue);
      
      case 'integer':
        return this.validateInteger(fieldValue);
      
      case 'confirmed':
        return this.validateConfirmed(fieldName, fieldValue);
      
      case 'url':
        return this.validateUrl(fieldValue);
      
      case 'alpha':
        return this.validateAlpha(fieldValue);
      
      case 'alpha_num':
        return this.validateAlphaNum(fieldValue);
      
      case 'alpha_dash':
        return this.validateAlphaDash(fieldValue);
      
      case 'between':
        const [min, max] = ruleValue.split(',').map((v: string) => parseInt(v));
        return this.validateBetween(fieldValue, min, max);
      
      case 'in':
        return this.validateIn(fieldValue, ruleValue.split(','));
      
      case 'not_in':
        return this.validateNotIn(fieldValue, ruleValue.split(','));
      
      case 'regex':
        return this.validateRegex(fieldValue, new RegExp(ruleValue));
      
      case 'same':
        return this.validateSame(fieldValue, this.data[ruleValue]);
      
      case 'different':
        return this.validateDifferent(fieldValue, this.data[ruleValue]);
      
      case 'boolean':
        return this.validateBoolean(fieldValue);
      
      case 'array':
        return this.validateArray(fieldValue);
      
      case 'string':
        return this.validateString(fieldValue);
      
      default:
        return true; // Unknown rule passes by default
    }
  }

  // Validation rule implementations
  private validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  private validateEmail(value: any): boolean {
    if (!value) return true; // Allow empty values (use required rule for mandatory)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private validateMin(value: any, min: number): boolean {
    if (!value) return true;
    if (typeof value === 'string') return value.length >= min;
    if (typeof value === 'number') return value >= min;
    if (Array.isArray(value)) return value.length >= min;
    return true;
  }

  private validateMax(value: any, max: number): boolean {
    if (!value) return true;
    if (typeof value === 'string') return value.length <= max;
    if (typeof value === 'number') return value <= max;
    if (Array.isArray(value)) return value.length <= max;
    return true;
  }

  private validateNumeric(value: any): boolean {
    if (!value) return true;
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  private validateInteger(value: any): boolean {
    if (!value) return true;
    return Number.isInteger(Number(value));
  }

  private validateConfirmed(fieldName: string, value: any): boolean {
    const confirmationField = `${fieldName}_confirmation`;
    return value === this.data[confirmationField];
  }

  private validateUrl(value: any): boolean {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private validateAlpha(value: any): boolean {
    if (!value) return true;
    return /^[a-zA-Z]+$/.test(value);
  }

  private validateAlphaNum(value: any): boolean {
    if (!value) return true;
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  private validateAlphaDash(value: any): boolean {
    if (!value) return true;
    return /^[a-zA-Z0-9_-]+$/.test(value);
  }

  private validateBetween(value: any, min: number, max: number): boolean {
    if (!value) return true;
    const length = typeof value === 'string' ? value.length : Number(value);
    return length >= min && length <= max;
  }

  private validateIn(value: any, allowedValues: string[]): boolean {
    if (!value) return true;
    return allowedValues.includes(String(value));
  }

  private validateNotIn(value: any, forbiddenValues: string[]): boolean {
    if (!value) return true;
    return !forbiddenValues.includes(String(value));
  }

  private validateRegex(value: any, pattern: RegExp): boolean {
    if (!value) return true;
    return pattern.test(value);
  }

  private validateSame(value: any, otherValue: any): boolean {
    return value === otherValue;
  }

  private validateDifferent(value: any, otherValue: any): boolean {
    return value !== otherValue;
  }

  private validateBoolean(value: any): boolean {
    return typeof value === 'boolean' || value === 'true' || value === 'false' || value === 1 || value === 0;
  }

  private validateArray(value: any): boolean {
    return Array.isArray(value);
  }

  private validateString(value: any): boolean {
    return typeof value === 'string';
  }

  /**
   * Add error to the errors object
   */
  private addError(fieldName: string, message: string) {
    if (!this.errors[fieldName]) {
      this.errors[fieldName] = [];
    }
    this.errors[fieldName].push(message);
  }

  /**
   * Get error message for a validation rule
   */
  private getErrorMessage(fieldName: string, rule: string, ruleValue?: any, customMessage?: string): string {
    // Check for custom message first
    if (customMessage) {
      return this.formatMessage(customMessage, fieldName, ruleValue);
    }

    // Check for custom messages in constructor
    const customKey = `${fieldName}.${rule}`;
    if (this.customMessages[customKey]) {
      return this.formatMessage(this.customMessages[customKey], fieldName, ruleValue);
    }

    // Use default message
    const defaultMessage = DEFAULT_MESSAGES[rule as keyof typeof DEFAULT_MESSAGES] || `The ${fieldName} field is invalid.`;
    return this.formatMessage(defaultMessage, fieldName, ruleValue);
  }

  /**
   * Format message with placeholders
   */
  private formatMessage(message: string, fieldName: string, ruleValue?: any): string {
    return message
      .replace(':field', this.formatFieldName(fieldName))
      .replace(':min', String(ruleValue))
      .replace(':max', String(ruleValue))
      .replace(':other', String(ruleValue))
      .replace(':format', String(ruleValue))
      .replace(':date', String(ruleValue));
  }

  /**
   * Format field name for display
   */
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }
}

/**
 * Static helper function for quick validation
 */
export function useValidateForm(
  data: FormData, 
  rules: ValidationRules, 
  customMessages: { [key: string]: string } = {}
): { isValid: boolean; errors: ValidationErrors } {
  const validator = new Validator(data, rules, customMessages);
  return validator.validate();
}

/**
 * Helper function to get first error for a field
 */
export function getFirstError(errors: ValidationErrors, fieldName: string): string | null {
  return errors[fieldName] && errors[fieldName].length > 0 ? errors[fieldName][0] : null;
}

/**
 * Helper function to check if field has errors
 */
export function hasError(errors: ValidationErrors, fieldName: string): boolean {
  return errors[fieldName] && errors[fieldName].length > 0;
}

/**
 * Helper function to get all errors as flat array
 */
export function getAllErrors(errors: ValidationErrors): string[] {
  const allErrors: string[] = [];
  Object.values(errors).forEach(fieldErrors => {
    allErrors.push(...fieldErrors);
  });
  return allErrors;
}
