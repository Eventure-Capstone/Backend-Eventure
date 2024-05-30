const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    // kita mengambil data dari inputan user
    const { name, email, password, age, gender, role } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    // validasi apakah email sudah terdaftar
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email tersebut sudah terdatar",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
      age,
      gender,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

		// cari data user berdasarkan email
    const user = await User.findOne({
      where: {
        email
      },
    });

		// validasi apakah email terdaftar
		if(!user) {
			return res.status(400).json({
				success: false,
				message: 'Email tidak ditemukan'
			})
		}

		// check apakah password benar
		const isValidPassword = await bcrypt.compare(password, user.password);
		if(!isValidPassword) {
			return res.status(400).json({
				success: false,
				message: 'Password anda salah'
			})
		}

		// buat token jwt
		const token = jwt.sign({
			"iss": "study-group",
			"sub": user.id,
			"iat": new Date().getTime(),
			"exp": new Date().setDate(new Date().getDate() + 7) // expires setelah 7 hari
		}, process.env.JWT_SECRET)

		return res.status(200).json({
			success: true,
			message: 'Berhasil login',
			data: {
				user,
				token
			}
		})

  } catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		})
	}
}

async function getAllUser(req, res) {
	try {
		const users = await User.findAll();

		return res.status(200).json({
			success: true,
			message: 'Berhasil mendapatkan semua user',
			data: users
		})
	} catch(error) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		})
	}
}

module.exports = {
  register,
	login,
	getAllUser
};
