import axios from "axios";

const TESTMAIL_API_BASE = "https://api.testmail.app/api/json";

function extractOtpFromHtml(body) {
  const otpRegex =
    /<\s*(?:b|strong)[^>]*>(\d{6})<\/\s*(?:b|strong)>.*?is the OTP/i;
  const otpMatch = body.match(otpRegex);
  return otpMatch ? otpMatch[1] : null;
}

async function fetchOtpFromEmail(
  testMail,
  testMailApiToken,
  testMailNamespace,
  maxRetries = 12,
  delayMs = 8000
) {
  let otpCode = null;
  let highestTimestampSeen = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const inboxResponse = await axios.get(
        `${TESTMAIL_API_BASE}?email=${testMail}&apikey=${testMailApiToken}&namespace=${testMailNamespace}&pretty=true&livequery=true`
      );

      const messages = inboxResponse.data.emails || [];

      const otpEmails = messages.filter((msg) =>
        /otp|one time password|Yatra : Login OTP/i.test(msg.subject)
      );

      const latestOtpEmail = otpEmails.find(
        (e) => e.timestamp > highestTimestampSeen
      );

      if (latestOtpEmail) {
        const body =
          latestOtpEmail.html || latestOtpEmail.parts?.[0]?.body || "";
        const candidateOtp = extractOtpFromHtml(body);

        if (candidateOtp) {
          otpCode = candidateOtp;
          highestTimestampSeen = latestOtpEmail.timestamp;
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching OTP email:", error.message);
    }

    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  console.log("Fetched OTP:", otpCode);
  return otpCode;
}

export default fetchOtpFromEmail;
