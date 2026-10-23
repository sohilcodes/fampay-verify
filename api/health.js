export default function handler(req, res) {
res.status(200).json({
success: true,
service: "FamPay Verify API",
status: "running",
message: "API is working"
});
}
