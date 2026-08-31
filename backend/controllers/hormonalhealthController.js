import HormonalHealth from "../models/HormonalHealth.js";

// ============================================================
// GET HORMONAL HEALTH DATA
// ============================================================

export const getHormonalHealth = async (req, res) => {
  try {
    const userId = req.user.id;

    let healthData = await HormonalHealth.findOne({
      user: userId,
    });

    if (!healthData) {
      healthData = await HormonalHealth.create({
        user: userId,
        cycleStartDate: new Date(),
        cycleLength: 28,
        periodLength: 5,
        mood: "Good",
        symptoms: [],
        history: [],
      });
    }

    res.status(200).json(healthData);
  } catch (error) {
    console.error("Get hormonal health error:", error);

    res.status(500).json({
      message: "Failed to get hormonal health data",
    });
  }
};

// ============================================================
// UPDATE HORMONAL HEALTH
// ============================================================

export const updateHormonalHealth = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      cycleStartDate,
      cycleLength,
      periodLength,
      mood,
      symptoms,
      symptomSeverity,
    } = req.body;

    let healthData = await HormonalHealth.findOne({
      user: userId,
    });

    if (!healthData) {
      healthData = new HormonalHealth({
        user: userId,
      });
    }

    if (cycleStartDate !== undefined) {
      healthData.cycleStartDate = cycleStartDate;
    }

    if (cycleLength !== undefined) {
      healthData.cycleLength = cycleLength;
    }

    if (periodLength !== undefined) {
      healthData.periodLength = periodLength;
    }

    if (mood !== undefined) {
      healthData.mood = mood;
    }

    if (symptoms !== undefined) {
      healthData.symptoms = symptoms;
    }

    if (symptomSeverity !== undefined) {
      healthData.symptomSeverity = symptomSeverity;
    }

    // Add today's tracking to history
    healthData.history.push({
      date: new Date(),
      mood: mood || healthData.mood,
      symptoms: symptoms || healthData.symptoms,
    });

    await healthData.save();

    res.status(200).json({
      message: "Hormonal health updated successfully",
      data: healthData,
    });
  } catch (error) {
    console.error("Update hormonal health error:", error);

    res.status(500).json({
      message: "Failed to update hormonal health",
    });
  }
};