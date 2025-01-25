const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process.env.AWS_REGION;
// Create SES service object.
console.log(process.env.AWS_ACCESS_KEY,process.env.AWS_SECRET_KEY);
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
module.exports = { sesClient };
