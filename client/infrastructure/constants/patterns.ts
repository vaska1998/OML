export const patternEmail =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const patternPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\/;:"-]).{8,}$/;
export const patternDigital = '[0-9]+';
export const patternPrice = /^\d+(\.\d{1,2})?$/ig;
export const patternPhoneNumber = /^\+\d{12}$/;
