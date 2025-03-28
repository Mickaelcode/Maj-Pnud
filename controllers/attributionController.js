const Attribution = require('../models/Attribution');
const SubRecipe = require('../models/subRecipe');
const Recipe = require("../models/Recipe")
const {Op} = require('sequelize')
const {getAllNotPayedContribuable } = require('../services/getAllNotPayedContribuable')

exports.createAttribution = async (req, res) => {
  try {
    const attribution = await Attribution.create(req.body);
    res.status(201).json(attribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAttributions = async (req, res) => {
  try {
    const attributions = await Attribution.findAll({
      include: [
        { model: SubRecipe, include: [
          {
            model: Recipe
          }
        ] }
      ],
    });
    res.status(200).json(attributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAttributionById = async (req, res) => {
  try {
    const attribution = await Attribution.findByPk(req.params.id, {
      include: [{ model: SubRecipe }],
    });
    if (attribution) {
      res.status(200).json(attribution);
    } else {
      res.status(404).json({ message: 'Attribution not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttribution = async (req, res) => {
  try {
    const [updated] = await Attribution.update(req.body, {
      where: { attribution_id: req.params.id },
    });
    if (updated) {
      const updatedAttribution = await Attribution.findByPk(req.params.id);
      res.status(200).json(updatedAttribution);
    } else {
      res.status(404).json({ message: 'Attribution not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAttribution = async (req, res) => {
  try {
    const deleted = await Attribution.destroy({
      where: { attribution_id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Attribution not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttributionsBySubrecipeId = async (req, res) => {
  try {
    const attributions = await Attribution.findAll({
      where: { subrecipe_id: req.params.subrecipeId },
      include: [{ model: SubRecipe }],
    });
    res.status(200).json(attributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttributionsByContribuableId = async (req, res) => {
  try {
    const attributions = await Attribution.findAll({
      where: { contribuable_id: req.params.contribuableId },
      include: [{ model: SubRecipe }],
    });
    res.status(200).json(attributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*
 *get all contrubuable that don't yet give money in a mounth/year
 Format date = YYYY-MM
 * */
exports.notPayed = async(req,res)=>{
	try {
		/*
		 *get date from the query request
		 pass the date to the function getAllNotPayedContribuable
		 it 's return a data =>  attribution  Id that not apear in 
		 
		 * **/
		const {date} = req.query;
		const allId  = await getAllNotPayedContribuable (date)
		const data = await Attribution.findAll({
			where:{
				attribution_id:{
					[Op.notIn]:[1,2]
				}	
			},
			include:[{
				model:SubRecipe
			}
			]
		})
		const msg = data? `here the data : ${data.length}`:'Empty'
		res.status(200).json({msg,data})
	} catch (e) {
		res.status(500).json({msg:e?e:'Server error'})
		/* handle error */
	}
}

