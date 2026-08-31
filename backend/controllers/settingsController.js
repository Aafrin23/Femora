import User from "../models/User.js";

// ============================================================
// GET SETTINGS
// ============================================================

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      settings: user.settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to get settings",
    });
  }
};

// ============================================================
// UPDATE SETTINGS
// ============================================================

export const updateSettings = async (req, res) => {
  try {
    const {
      theme,
      accountPrivacy,
      aiEnabled,
      personalizedAI,
      language,
      landingPage,
      motivationalMessages,
      autoSave,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Make sure settings exists
    if (!user.settings) {
      user.settings = {};
    }

    if (theme !== undefined) {
      user.settings.theme = theme;
    }

    if (accountPrivacy !== undefined) {
      user.settings.accountPrivacy = accountPrivacy;
    }

    if (aiEnabled !== undefined) {
      user.settings.aiEnabled = aiEnabled;
    }

    if (personalizedAI !== undefined) {
      user.settings.personalizedAI = personalizedAI;
    }

    if (language !== undefined) {
      user.settings.language = language;
    }

    if (landingPage !== undefined) {
      user.settings.landingPage = landingPage;
    }

    if (motivationalMessages !== undefined) {
      user.settings.motivationalMessages =
        motivationalMessages;
    }

    if (autoSave !== undefined) {
      user.settings.autoSave = autoSave;
    }

    await user.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to update settings",
    });
  }
};

// ============================================================
// DELETE ACCOUNT
// ============================================================

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete account",
    });
  }
};