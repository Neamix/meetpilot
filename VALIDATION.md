# Laravel-Style Form Validation System

A comprehensive, Laravel-inspired form validation system for TypeScript/JavaScript applications with React integration.

## Features

✅ **Laravel-style validation rules** (`required|email|min:8|max:100`)  
✅ **Array-based error return format** like Laravel Form Requests  
✅ **Customizable error messages** with placeholders  
✅ **20+ built-in validation rules**  
✅ **TypeScript support** with full type safety  
✅ **React hooks** for easy integration  
✅ **Real-time field validation**  
✅ **Business logic validation**  

## Quick Start

### 1. Basic Usage

```typescript
import { validateForm } from '@/lib/validation';

// Validate login form
const { isValid, errors } = validateForm(
  { 
    email: 'user@example.com', 
    password: '123456' 
  },
  {
    email: 'required|email',
    password: 'required|min:8'
  }
);

if (!isValid) {
  console.log(errors);
  // Output: { password: ['The password must be at least 8 characters.'] }
}
```

### 2. With Custom Messages

```typescript
const { isValid, errors } = validateForm(
  { email: '', password: '123' },
  { 
    email: 'required|email',
    password: 'required|min:8'
  },
  {
    'email.required': 'Please enter your email address',
    'password.min': 'Password must be at least 8 characters for security'
  }
);
```

### 3. Using React Hook

```typescript
import { useLoginValidation } from '@/lib/auth-validation';

function LoginForm() {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    getFieldError,
    hasFieldError
  } = useLoginValidation();

  return (
    <form onSubmit={handleSubmit(async (data) => {
      // Your submit logic here
      await authClient.signIn.email(data);
    })}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        className={hasFieldError('email') ? 'border-red-500' : ''}
      />
      {getFieldError('email') && (
        <p className="text-red-500">{getFieldError('email')}</p>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## Available Validation Rules

| Rule | Example | Description |
|------|---------|-------------|
| `required` | `required` | Field must have a value |
| `email` | `email` | Must be valid email format |
| `min:n` | `min:8` | Minimum length/value |
| `max:n` | `max:100` | Maximum length/value |
| `between:min,max` | `between:8,50` | Length/value between range |
| `numeric` | `numeric` | Must be a number |
| `integer` | `integer` | Must be an integer |
| `alpha` | `alpha` | Only letters |
| `alpha_num` | `alpha_num` | Letters and numbers only |
| `alpha_dash` | `alpha_dash` | Letters, numbers, dashes, underscores |
| `url` | `url` | Must be valid URL |
| `confirmed` | `confirmed` | Must match `field_confirmation` |
| `same:field` | `same:password` | Must match another field |
| `different:field` | `different:old_password` | Must be different from another field |
| `in:val1,val2` | `in:male,female,other` | Must be one of specified values |
| `not_in:val1,val2` | `not_in:admin,root` | Must not be one of specified values |
| `regex:pattern` | `regex:^[A-Z]+$` | Must match regex pattern |
| `boolean` | `boolean` | Must be boolean value |
| `array` | `array` | Must be an array |
| `string` | `string` | Must be a string |

## Rule Formats

### String Format (Laravel-style)
```typescript
const rules = {
  email: 'required|email',
  password: 'required|min:8|max:100',
  age: 'required|integer|min:18|max:120'
};
```

### Array Format (with custom messages)
```typescript
const rules = {
  email: [
    { rule: 'required', message: 'Email is required' },
    { rule: 'email', message: 'Please enter a valid email' }
  ],
  password: [
    { rule: 'required' },
    { rule: 'min', value: 8, message: 'Password must be at least 8 characters' }
  ]
};
```

## Error Format

The validation system returns errors in Laravel's format:

```typescript
{
  email: ['Please enter your email address', 'Email format is invalid'],
  password: ['Password must be at least 8 characters'],
  name: ['Full name is required']
}
```

## Helper Functions

### `getFirstError(errors, fieldName)`
```typescript
const firstEmailError = getFirstError(errors, 'email');
// Returns: "Please enter your email address" or null
```

### `hasError(errors, fieldName)`
```typescript
const hasEmailError = hasError(errors, 'email');
// Returns: true or false
```

### `getAllErrors(errors)`
```typescript
const allErrors = getAllErrors(errors);
// Returns: ['Email is required', 'Password too short', ...]
```

## Pre-built Auth Validation

For authentication forms, use the pre-built validation functions:

```typescript
import { 
  validateLoginCredentials,
  validateRegistrationData,
  useLoginValidation,
  useRegistrationValidation 
} from '@/lib/auth-validation';

// Validate login
const loginResult = validateLoginCredentials('user@example.com', 'password123');

// Validate registration
const registerResult = validateRegistrationData(
  'John Doe',
  'john@example.com', 
  'password123',
  'password123'
);
```

## Advanced Usage

### Complex Password Validation
```typescript
import { validateComplexPassword } from '@/lib/auth-validation';

const result = validateComplexPassword('MyP@ssw0rd');
// Validates: length, uppercase, lowercase, number, special char
```

### Business Logic Validation
```typescript
import { validateBusinessRules } from '@/lib/auth-validation';

const result = validateBusinessRules({
  email: 'user@tempmail.com',
  user_type: 'admin',
  password: 'password123'
});
// Custom business rules: blocked domains, admin requirements, etc.
```

### Dynamic Rules
```typescript
import { createDynamicValidation } from '@/lib/validation-examples';

const rules = createDynamicValidation(
  ['email', 'password', 'phone'], 
  ['email', 'password'] // required fields
);
// Automatically creates appropriate rules based on field names
```

## Integration with UI Components

### Error Display Component
```typescript
function FieldError({ errors, fieldName }: { errors: ValidationErrors, fieldName: string }) {
  const error = getFirstError(errors, fieldName);
  if (!error) return null;
  
  return <p className="text-red-500 text-sm mt-1">{error}</p>;
}
```

### Input with Validation
```typescript
function ValidatedInput({ 
  name, 
  value, 
  onChange, 
  errors, 
  rules = 'required' 
}: ValidatedInputProps) {
  const hasErr = hasError(errors, name);
  
  return (
    <div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`border ${hasErr ? 'border-red-500' : 'border-gray-300'}`}
      />
      <FieldError errors={errors} fieldName={name} />
    </div>
  );
}
```

## Error Message Customization

### Field-specific Messages
```typescript
const customMessages = {
  'email.required': 'We need your email to contact you',
  'email.email': 'Please check your email format',
  'password.min': 'Choose a stronger password (min 8 chars)',
  'name.alpha_dash': 'Name can only contain letters, numbers, and dashes'
};
```

### Message Placeholders
- `:field` - The field name (formatted)
- `:min` - Minimum value
- `:max` - Maximum value
- `:other` - Other field name (for same/different rules)

## Best Practices

1. **Always validate on both client and server**
2. **Use appropriate validation rules for your use case**
3. **Provide clear, helpful error messages**
4. **Clear field errors when user starts typing**
5. **Show loading states during form submission**
6. **Group related validations in reusable functions**

## Examples in Your App

Check these files for complete examples:
- `src/lib/validation.ts` - Core validation system
- `src/lib/auth-validation.ts` - Auth-specific validations
- `src/lib/validation-examples.ts` - Usage examples
- `src/app/auth/page.tsx` - Integration in React components

This validation system provides enterprise-level form validation with the simplicity and power of Laravel's validation system, perfectly suited for modern TypeScript/React applications.
