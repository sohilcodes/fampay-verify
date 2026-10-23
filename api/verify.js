import { FamPayVerifier } from '../dist/index.js';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({
success: false,
message: 'POST method required'
});
}

const { amount, utr, txnid, userId } = req.body || {};

if (
amount === undefined ||
amount === null ||
amount === '' ||
!Number.isFinite(Number(amount)) ||
Number(amount) <= 0
) {
return res.status(400).json({
success: false,
verified: false,
message: 'A valid positive amount is required'
});
}

if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD) {
return res.status(503).json({
success: false,
verified: false,
message: 'Verification service is not configured'
});
}

try {
const verifier = new FamPayVerifier({
gmail: process.env.GMAIL_ADDRESS,
gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
supabaseUrl: process.env.SUPABASE_URL,
supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});

const result = await verifier.verifyPayment({
  amount: Number(amount),
  utr: typeof utr === 'string' ? utr.trim() : undefined,
  txnid: typeof txnid === 'string' ? txnid.trim() : undefined,
  userId: typeof userId === 'string' ? userId : undefined
});

return res.status(200).json({
  success: true,
  ...result
});

} catch {
return res.status(500).json({
success: false,
verified: false,
message: 'Internal verification error'
});
}
}
