// GET current user preferences
router.get("/", authenticate, async (req, res) => {
  try {
    console.log("Fetching preferences for user ID:", req.user.id);
    const user = await User.findById(req.user.id).select("sessionPreferences");
    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User sessionPreferences:", user.sessionPreferences);
    res.json(user.sessionPreferences || {});
  } catch (err) {
    console.error("GET /api/user-preferences error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update user preferences
router.put("/", authenticate, async (req, res) => {
  try {
    const { breathingSessionLevel } = req.body;
    if (!breathingSessionLevel) {
      return res
        .status(400)
        .json({ message: "Breathing session level is required" });
    }

    console.log(
      "Updating preferences for user ID:",
      req.user.id,
      "to",
      breathingSessionLevel
    );

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize if undefined
    if (!user.sessionPreferences) {
      user.sessionPreferences = {};
    }

    user.sessionPreferences.breathingSessionLevel = breathingSessionLevel;

    await user.save();
    res.json({ message: "Preferences updated successfully" });
  } catch (err) {
    console.error("PUT /api/user-preferences error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
