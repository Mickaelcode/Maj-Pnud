const { Op } = require("sequelize");
const Attribution = require("../models/Attribution");

async function getTaxReportWithComparison(req, res) {
  try {
    const { type, date } = req.query;

    // Validation des paramètres
    if (!type || !date) {
      return res.status(400).json({ error: "Type et date sont requis" });
    }

    if (!['day', 'month', 'year'].includes(type)) {
      return res.status(400).json({ error: "Type doit être 'day', 'month' ou 'year'" });
    }

    // 1. Calcul pour la période demandée
    const { startDate, endDate } = getDateRange(type, date);
    const currentData = await getTaxData(startDate, endDate);

    // 2. Calcul pour la période précédente
    const { startDate: prevStartDate, endDate: prevEndDate } = getPreviousPeriod(type, date);
    const previousData = await getTaxData(prevStartDate, prevEndDate);

    // 3. Calcul des variations
    const fiscalVariation = calculateVariation(currentData.fiscal, previousData.fiscal);
    const nonFiscalVariation = calculateVariation(currentData.nonFiscal, previousData.nonFiscal);
    const totalVariation = calculateVariation(currentData.total, previousData.total);

    // 4. Formatage de la réponse
    res.json({
      type: type,
      period: formatDateRange(type, startDate, endDate),
      fiscal: currentData.fiscal,
      non_fiscal: currentData.nonFiscal,
      total: currentData.total,
      rapport: {
        fiscal: fiscalVariation,
        non_fiscal: nonFiscalVariation,
        total: totalVariation
      }
    //   ,
    //   previous_period: {
    //     date: formatDateRange(type, prevStartDate, prevEndDate),
    //     fiscal: previousData.fiscal,
    //     non_fiscal: previousData.nonFiscal,
    //     total: previousData.total
    //   }
    });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Helper functions

function getDateRange(type, dateString) {
  const date = new Date(dateString);
  let startDate, endDate;

  if (type === 'day') {
    startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  } 
  else if (type === 'month') {
    startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  } 
  else { // year
    startDate = new Date(date.getFullYear(), 0, 1);
    endDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }

  return { startDate, endDate };
}

function getPreviousPeriod(type, dateString) {
  const date = new Date(dateString);
  let prevDate;

  if (type === 'day') {
    prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
  } 
  else if (type === 'month') {
    prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  } 
  else { // year
    prevDate = new Date(date.getFullYear() - 1, 0, 1);
  }

  return getDateRange(type, prevDate);
}

async function getTaxData(startDate, endDate) {
  const attributions = await Attribution.findAll({
    where: {
      attribution_date: {
        [Op.between]: [startDate, endDate]
      }
    },
    raw: true
  });

  let fiscal = 0;
  let nonFiscal = 0;

  // Logique temporaire - à adapter selon vos besoins
  attributions.forEach(att => {
    // Exemple: prix > 100 = fiscal, sinon non-fiscal
    if (att.price > 100) {
      fiscal += parseFloat(att.price);
    } else {
      nonFiscal += parseFloat(att.price);
    }
  });

  return {
    fiscal,
    nonFiscal,
    total: fiscal + nonFiscal
  };
}

function calculateVariation(current, previous) {
  if (previous === 0) return current === 0 ? "0%" : "+∞%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

function formatDateRange(type, startDate, endDate) {
  if (type === 'day') {
    return startDate.toISOString().split('T')[0];
  }
  else if (type === 'month') {
    return startDate.toISOString().slice(0, 7); // YYYY-MM
  }
  else {
    return startDate.getFullYear().toString(); // YYYY
  }
}

module.exports = getTaxReportWithComparison;