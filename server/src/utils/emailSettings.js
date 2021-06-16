const settings = {
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PW,
    },
};

module.exports = settings;