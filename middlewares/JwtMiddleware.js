const jwt = require("jsonwebtoken");

async function JwtMiddleware(req, res, next) {
	try {
		const header = req.headers.authorization;
		const token = header && header.split(" ")[1];

		// cek apakah token ada
		if(!token) {
			return res.status(401).json({
				success: false,
				message: "Token not found"
			});
		}

		// cek apakah token valid
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		if(!verified) {
			return res.status(401).json({
				success: false,
				message: "Token not valid"
			});
		}

		// simpan data user id ke global variable
		req.user = verified.sub

		next()
	} catch(error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
}

module.exports = JwtMiddleware;