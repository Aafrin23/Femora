import Wellness from "../models/Wellness.js";

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =====================================================
// GET TODAY'S WELLNESS
// =====================================================

export const getTodayWellness = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const date = getToday();

    let wellness =
      await Wellness.findOne({
        user: userId,
        date,
      });

    // Create today's record if it doesn't exist
    if (!wellness) {
      wellness = await Wellness.create({
        user: userId,
        date,

        categories: {
          mental: {
            completed: [],
          },
          physical: {
            completed: [],
          },
          emotional: {
            completed: [],
          },
          spiritual: {
            completed: [],
          },
          social: {
            completed: [],
          },
        },

        wellnessScore: 0,
      });
    }

    res.status(200).json(wellness);
  } catch (error) {
    console.error(
      "Get wellness error:",
      error
    );

    res.status(500).json({
      message: "Failed to get wellness data",
    });
  }
};


// =====================================================
// UPDATE HABIT
// =====================================================

export const updateHabit = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const { category, habitId } =
      req.body;

    if (!category || !habitId) {
      return res.status(400).json({
        message:
          "Category and habitId are required",
      });
    }

    const validCategories = [
      "mental",
      "physical",
      "emotional",
      "spiritual",
      "social",
    ];

    if (
      !validCategories.includes(category)
    ) {
      return res.status(400).json({
        message: "Invalid wellness category",
      });
    }

    const date = getToday();

    let wellness =
      await Wellness.findOne({
        user: userId,
        date,
      });

    if (!wellness) {
      wellness = await Wellness.create({
        user: userId,
        date,
      });
    }

    const completed =
      wellness.categories[
        category
      ].completed;

    // Toggle habit
    if (completed.includes(habitId)) {
      wellness.categories[
        category
      ].completed =
        completed.filter(
          (id) => id !== habitId
        );
    } else {
      wellness.categories[
        category
      ].completed.push(habitId);
    }

    // Calculate score
    const categoryScores = [
      "mental",
      "physical",
      "emotional",
      "spiritual",
      "social",
    ].map((categoryName) => {
      const count =
        wellness.categories[
          categoryName
        ].completed.length;

      // Currently assuming 6 habits/category
      return (count / 6) * 100;
    });

    const total =
      categoryScores.reduce(
        (sum, score) => sum + score,
        0
      );

    wellness.wellnessScore =
      Math.round(
        total /
          categoryScores.length
      );

    await wellness.save();

    res.status(200).json({
      message: "Habit updated",
      wellness,
    });
  } catch (error) {
    console.error(
      "Update wellness habit error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update wellness habit",
    });
  }
};