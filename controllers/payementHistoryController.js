const PayementHistory = require('../models/PayementHistory');
const Attribution = require('../models/Attribution');
const Recipe = require('../models/Recipe');
const SubRecipe = require('../models/subRecipe');
const { Op, fn, col, literal } = require('sequelize');

exports.createPayementHistory = async (req, res) => {
  try {
    const { type, amount, payementId } = req.body;

    if (type === 'espece' && (amount === null || payementId !== null)) {
      return res.status(400).json({ message: 'Invalid data for espece payment.' });
    }

    if (type === 'mobile money' && (payementId === null || amount == null)) {
      return res.status(400).json({ message: 'Invalid data for mobile money payment.' });
    }

    const payementHistory = await PayementHistory.create(req.body);
    res.status(201).json(payementHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payment history records
exports.getAllPayementHistory = async (req, res) => {
  try {
    const payementHistory = await PayementHistory.findAll({
      include: [{ model: Attribution, include: [{ model: SubRecipe, include: [{model: Recipe}]}] }],
    });
    res.status(200).json(payementHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFullTransactions = async (req, res) => {
  try {
    const payementHistory = await PayementHistory.findAll({
      include: [{ model: Attribution }],
    });

    for (const item of payementHistory) {
      const attribution = await Attribution.findByPk(item.attribution_id, { include: ["SubRecipe"] });
      if (!attribution) continue;

      const subrecipe = await SubRecipe.findByPk(attribution.subRecipe_id, { include: ["Parent", "SubCategories"] });
      if (!subrecipe) continue;

      const recipe = await Recipe.findByPk(subrecipe.recipeId);
      if (!recipe) continue;

      const parentSubrecipe = await SubRecipe.findByPk(subrecipe.parentId, { include: ["Parent", "SubCategories"] });

      item.categorie = parentSubrecipe ? parentSubrecipe.label : "Catégorie inconnue";
      item.cin = attribution.contribuable_id;
      item.somme = subrecipe.price;
      item.libelle = recipe.label;
      item.nature = recipe.recipe_type;
    }

    res.status(200).json(payementHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionBetweenTwoDate = (req, res) => {
  const { date1, date2 } = req.body
  let fullPayement = this.getFullTransactions(req, res)
  fullPayement.forEach((item, index) => {
    if (Date(date1) > Date(item.date) || Date(date2) < Date(item.date)) {
      fullPayement.splice(index, 1)
    }
  });
  fullPayement.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.status(201).json({ fullPayement })
  return fullPayement
}

exports.getPayementHistoryById = async (req, res) => {
  try {
    const payementHistory = await PayementHistory.findByPk(req.params.id, {
      include: [{ model: Attribution }], // Include associated Attribution data
    });
    if (payementHistory) {
      res.status(200).json(payementHistory);
    } else {
      res.status(404).json({ message: 'Payement History not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayementHistory = async (req, res) => {
  try {
    const [updated] = await PayementHistory.update(req.body, {
      where: { payementHistory_id: req.params.id },
    });
    if (updated) {
      const updatedPayementHistory = await PayementHistory.findByPk(req.params.id);
      res.status(200).json(updatedPayementHistory);
    } else {
      res.status(404).json({ message: 'Payement History not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayementHistory = async (req, res) => {
  try {
    const deleted = await PayementHistory.destroy({
      where: { payementHistory_id: req.params.id },
    });
    if (deleted) {
      res.status(204).send({message: "delete success"});
    } else {
      res.status(404).json({ message: 'Payement History not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayementHistoryByAttributionId = async (req, res) => {
  try {
    const payementHistory = await PayementHistory.findAll({
      where: { attributionId: req.params.attributionId },
      include: [{ model: Attribution }],
    });
    res.status(200).json(payementHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrevisionByRecipeType = async (req, res) => {
  const { recipeType } = req.body
  const recipes = await Recipe.findAll({
    where: {
      recipe_type: recipeType
    },
    include: [
      {
        model: SubRecipe,
        include: [
          {
            model: Attribution,
            include: [
              {
                model: PayementHistory
              }
            ]
          }
        ]
      }
    ]
  });

  const previsions = recipes.map(recipe => {
    return recipe.SubRecipes.map(subrecipe => {
      const periodicity = subrecipe.periodicity;
      let frequencyInMonths;

      // Calculer la fréquence en mois (1 = mensuel, 3 = trimestriel, 12 = annuel)
      switch (periodicity) {
        case 'mensuel':
          frequencyInMonths = 1; // Mensuel
          break;
        case 'trimestriel':
          frequencyInMonths = 3; // Trimestriel
          break;
        case 'annuel':
          frequencyInMonths = 12; // Annuel
          break;
        // Ajouter d'autres périodicités si nécessaire
        default:
          frequencyInMonths = 1; // Par défaut, on suppose mensuel
      }

      // Calculer la somme des paiements effectués dans la période spécifiée
      const totalPayments = subrecipe.Attributions.reduce((sum, attribution) => {
        return sum + attribution.PayementHistories.reduce((paySum, payment) => {
          return paySum + payment.amount; // Ajouter le montant du paiement
        }, 0);
      }, 0);

      // Calculer la prévision des paiements futurs pour la période à venir
      const currentDate = new Date();
      const monthsRemaining = Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24 * 30)); // Nombre de mois restants

      const projectedPayments = Math.ceil(monthsRemaining / frequencyInMonths) * totalPayments; // Prévision

      return {
        recipeType: recipe.recipe_type,
        totalPayments,
        projectedPayments
      };
    });
  });

  const aggregatedPrevisions = previsions.flat().reduce((acc, item) => {
    if (!acc[item.recipeType]) {
      acc[item.recipeType] = {
        totalPayments: 0,
        projectedPayments: 0
      };
    }
    acc[item.recipeType].totalPayments += item.totalPayments;
    acc[item.recipeType].projectedPayments += item.projectedPayments;
    return acc;
  }, {});
  return aggregatedPrevisions;
}


// exports.getTotalBySubRecipeForMonth = async (req, res) => {
//   try {
//     const { month, year } = req.query;

//     const results = await PayementHistory.findAll({
//       attributes: [
//         [fn('SUM', col('PayementHistory.amount')), 'totalAmount'],
//         [col('Attribution.SubRecipe.label'), 'subRecipeLabel']
//       ],
//       include: [
//         {
//           model: Attribution,
//           include: [
//             {
//               model: SubRecipe,
//               attributes: [] // Exclut les colonnes inutiles
//             }
//           ]
//         }
//       ],
//       where: {
//         date: {
//           [Op.between]: [
//             new Date(`${year}-${month}-01T00:00:00.000Z`),
//             new Date(`${year}-${month}-31T23:59:59.999Z`)
//           ]
//         }
//       },
//       group: ['Attribution.SubRecipe.label']
//     });

//     res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

exports.getTotalBySubRecipeForMonth = async (req, res) => {
  try {
    let { month, year } = req.query;

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: "Mois ou année invalide." });
    }

    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if (month < 1 || month > 12) {
      return res.status(400).json({ message: "Le mois doit être compris entre 1 et 12." });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const results = await PayementHistory.findAll({
      attributes: [
        [fn("SUM", col("PayementHistory.amount")), "totalAmount"],
        [col("Attribution.SubRecipe.label"), "subRecipeLabel"]
      ],
      include: [
        {
          model: Attribution,
          attributes: ["attribution_id"],
          include: [
            {
              model: SubRecipe,
              attributes: ["subRecipe_id", "label"]
            }
          ]
        }
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [
        "Attribution.attribution_id",
        "Attribution.SubRecipe.subRecipe_id",
        "Attribution.SubRecipe.label"
      ]
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getAllTrosa = async (req, res) => {

//     const allAttributions = await Attribution.findAll({
//       include: [
//         { model: SubRecipe, include: [
//           {
//             model: Recipe
//           }
//         ] }
//       ],
//     });
    
//     allAttributions.map(element => {
//       const firstDate = element.attribution_date
//       const periodicity = element.SubRecipe.periodicity
//       const lastDate = new Date().toISOString()
//       const enumPeriodicity = {jounalier: 1, mensuel: 30, ann}
//     })

// }
