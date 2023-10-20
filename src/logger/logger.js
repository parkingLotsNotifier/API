const winston = require('winston');
const SlackHook = require("winston-slack-webhook-transport");


function createLogger(logName) {


        const customTimestamp = winston.format((info, opts) => {
            if (opts.timestamp) {
                info.timestamp = new Date().toLocaleString('he-IL', { hour12: false }).replace(/, /g, '-');
            }
            return info;
        });

const slackInfoTransport = new SlackHook({
    level:'info',
    webhookUrl:'https://hooks.slack.com/services/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'
})

const slackErrorTransport = new SlackHook({
    level:'error',
    webhookUrl:'https://hooks.slack.com/services/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'
})

const logger = winston.createLogger({
    format: winston.format.combine(
        customTimestamp({ timestamp: true }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [slackInfoTransport,slackErrorTransport]
});

return logger
}

module.exports = {
    createLogger
};