const dotenv = require("dotenv");
dotenv.config({path:'.env'});
const env = {
            DB_USERNAME : process.env.DB_USERNAME,
            DB_PASSWORD : process.env.DB_PASSWORD,
            DB_HOST : process.env.DB_HOST,
            PORT : process.env.PORT,
            GREETING:'hello',
            FAREWELL:'goodbye',
            TELEGRAM_TOKEN : process.env.TELEGRAM_TOKEN,
            GMAIL_PASS : process.env.GMAIL_PASS,
            GMAIL_USERNAME : process.env.GMAIL_USERNAME,
            MAIL_DEST : process.env.MAIL_DEST,
            MAIL_SOURCE : process.env.MAIL_SOURCE,
            CHAT_ID : process.env.CHAT_ID
            };
module.exports=env;
