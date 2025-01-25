const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "hello",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${subject}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "binshuyadav123@gmail.com",
    "mritunjay@devtinder.space",
    subject,
    body
  );

  try {
    // console.log(process.env.AWS_ACCESS_KEY)
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
