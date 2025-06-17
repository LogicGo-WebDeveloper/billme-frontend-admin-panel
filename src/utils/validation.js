// import * as Yup from 'yup';

// export const getValidationSchema = (fieldName, isRequired = true) => {
//   const baseSchema = {
//     email: Yup.string()
//       .email('Please enter a valid email')
//       .required(isRequired ? `${fieldName} is required` : false),
//     password: Yup.string()
//       .min(8, 'Password must be at least 8 characters')
//       .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .matches(/[0-9]/, 'Password must contain at least one number')
//       .required(isRequired ? `${fieldName} is required` : false),
//     username: Yup.string()
//       .min(3, 'Username must be at least 3 characters')
//       .max(50, 'Username must be less than 50 characters')
//       .required(isRequired ? `${fieldName} is required` : false),
//   };

//   return baseSchema[fieldName] || Yup.string().required(isRequired ? `${fieldName} is required` : false);
// };

export const getValidationRule = (fieldName, isRequired = true, formInstance = null) => {
  const validateField = (value) => {
    // First check if field is required and empty
    if (isRequired && !value) {
      return Promise.reject(`${fieldName} is required`);
    }

    // If not required and empty, return success
    if (!value) return Promise.resolve();

    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return Promise.reject("Please enter a valid email");
        }
        break;

      case "password":
        if (value.length < 8) {
          return Promise.reject("Password must be at least 8 characters");
        }
        if (!/[A-Z]/.test(value)) {
          return Promise.reject(
            "Password must contain at least one uppercase letter"
          );
        }
        if (!/[a-z]/.test(value)) {
          return Promise.reject(
            "Password must contain at least one lowercase letter"
          );
        }
        if (!/[0-9]/.test(value)) {
          return Promise.reject("Password must contain at least one number");
        }
        break;

      case "confirmPassword":
        if (!formInstance) {
          return Promise.reject("Form instance not provided");
        }
        const password = formInstance.getFieldValue("password");
        if (value !== password) {
          return Promise.reject("Passwords do not match!!!");
        }
        break;

      case "name":
        if (value.length < 3) {
          return Promise.reject("Username must be at least 3 characters");
        }
        if (value.length > 50) {
          return Promise.reject("Username must be less than 50 characters");
        }
        break;

      case "otp":
        if (!/^\d{4}$/.test(value)) {
          return Promise.reject("OTP must be exactly 4 digits");
        }
        break;

      case "Account Number":
        if (value.includes(" ")) {
          return Promise.reject("Account Number must not contain spaces");
        }
        if (!/^\d+$/.test(value)) {
          return Promise.reject("Account Number must be a valid number");
        }
        if (value.length !== 16) {
          return Promise.reject("Account Number must be 16 digits");
        }
        break;

      case "IFSC Code":
        if (value.includes(" ")) {
          return Promise.reject("IFSC Code must not contain spaces");
        }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          return Promise.reject("Invalid IFSC Code format (e.g., SBIN0123456)");
        }
        break;

      case "Project":
        if (value === "") {
          return Promise.reject("Please select a project");
        }
        break;

      default:
        // For any other field, just check if required
        if (isRequired && !value) {
          return Promise.reject(`${fieldName} is required`);
        }
    }

    return Promise.resolve();
  };

  return [
    {
      validator: (_, value) => validateField(value),
      required: isRequired,
    },
  ];
};
