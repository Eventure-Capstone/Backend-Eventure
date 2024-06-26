import userServices from "../services/user_service.js";
import uploadServices from "../services/upload_service.js";

const register = async (req, res, next) => {
  const { full_name, email, password } = req.body;
  try {
    const user = await userServices.register(full_name, email, password);
    res.json({
      success: true,
      message: "Registrasi berhasil",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { email, otp_code } = req.body;
  try {
    const user = await userServices.verify_otp(email, otp_code);
    res.status(200).json({
      success: true,
      message: "Akun berhasil diverifikasi",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userServices.login(email, password);
    res.status(200).json({
      success: true,
      data: { token: token },
      message: "User logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
      message: "Data semua user berhasil didapatkan",
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    await userServices.updateUser(id, fullName, email, password);
    res.status(200).json({
      success: true,
      message: "User berhasil diupdate",
    });
  } catch (err) {
    console.log(req.params);
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userServices.getUserById(id);
    res.status(200).json({
      success: true,
      data: user,
      message: "Get user profile",
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userServices.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const imageUrl = await uploadServices.uploadImageToGCS(req.file);
    const updatedUser = await userServices.updateUserProfileImage(
      req.user.id,
      imageUrl
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { event_name, author, category, description, location, date, time } =
      req.body;
    const event = await userServices.createEvent(
      event_name,
      author,
      category,
      description,
      location,
      date,
      time
    );
    res.status(201).json({
      success: true,
      data: event,
      message: "Event berhasil dibuat",
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {};

export default {
  register,
  verify,
  login,
  uploadProfileImage,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createEvent,
  logout,
};
