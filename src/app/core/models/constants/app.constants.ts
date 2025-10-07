export const SYSTEM_SETTINGS_LIMITS = {
  SESSION_TIMEOUT: {
    MIN: 30,
    MAX: 480,
  },
  OTP_VALIDATION: {
    MIN: 30,
    MAX: 120,
  },
};

export const SYSTEM_CONSTANTS = {
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,24}$/
}