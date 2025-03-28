const { Op } = require("sequelize");
const Attribution = require("../models/Attribution");
const SubRecipe = require("../models/subRecipe");
const Recipe = require("../models/Recipe");

async function getTaxReportWithComparison(req, res) {
  try {
    let { date } = req.query;

    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    const periods = {
      journalier: { current: getDateRange("day", date), previous: getPreviousPeriod("day", date) },
      mensuel: { current: getDateRange("month", date), previous: getPreviousPeriod("month", date) },
      annuel: { current: getDateRange("year", date), previous: getPreviousPeriod("year", date) },
    };

    const results = {};
    for (const [key, { current, previous }] of Object.entries(periods)) {
      const currentData = await getTransactionCount(current.startDate, current.endDate);
      const previousData = await getTransactionCount(previous.startDate, previous.endDate);

      results[key] = {
        total: currentData.total,
        fiscal: currentData.fiscal,
        nonFiscal: currentData.nonFiscal,
        rapport: `${calculateVariation(currentData.total, previousData.total)} par rapport à ${
          key === "journalier" ? "hier" : key === "mensuel" ? "au mois dernier" : "l'année précédente"
        }`,
      };
    }

    res.json(results);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function getTransactionCount(startDate, endDate) {
  const attributions = await Attribution.findAll({
    where: {
      attribution_date: { [Op.between]: [startDate, endDate] },
    },
    include: [
      {
        model: SubRecipe,
        include: [{ model: Recipe }],
      },
    ],
    raw: true,
    nest: true,
  });

  let fiscal = 0;
  let nonFiscal = 0;

  attributions.forEach(att => {
    if (att.SubRecipe && att.SubRecipe.Recipe) {
      if (att.SubRecipe.Recipe.recipe_type === "Fiscal") {
        fiscal += 1;
      } else if (att.SubRecipe.Recipe.recipe_type === "Non fiscal") {
        nonFiscal += 1;
      }
    }
  });

  return {
    fiscal,
    nonFiscal,
    total: fiscal + nonFiscal,
  };
}

function calculateVariation(current, previous) {
  if (previous === 0) return current === 0 ? "0%" : "+∞%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(2)}%`;
}

function getDateRange(type, dateString) {
  const date = new Date(dateString);
  let startDate, endDate;

  if (type === "day") {
    startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  } else if (type === "month") {
    startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  } else {
    startDate = new Date(date.getFullYear(), 0, 1);
    endDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }

  return { startDate, endDate };
}

function getPreviousPeriod(type, dateString) {
  const date = new Date(dateString);
  let prevDate;

  if (type === "day") {
    prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
  } else if (type === "month") {
    prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  } else {
    prevDate = new Date(date.getFullYear() - 1, 0, 1);
  }

  return getDateRange(type, prevDate);
}

module.exports = getTaxReportWithComparison;
