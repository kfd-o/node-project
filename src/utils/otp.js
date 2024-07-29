// src/utils/otp.js

const otpStore = new Map(); // use a better storage in production like Redis

export const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // generate a 6-digit OTP
};

export const storeOtp = async (email, otp) => {
    otpStore.set(email, otp);
    setTimeout(() => otpStore.delete(email), 300000); // OTP expires in 5 minutes
};

export const verifyOtp = async (email, otp) => {
    const storedOtp = otpStore.get(email);
    if (storedOtp === otp) {
        otpStore.delete(email);
        return true;
    }
    return false;
};
