const PerceptorLocation = require('../models/PerceptorLocation');
const Localization = require("../models/Localization")

const createPerceptorLocation = async (req, res) => {
  try {
    const perceptorLocation = await PerceptorLocation.create(req.body);
    res.status(201).json(perceptorLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPerceptorLocations = async (req, res) => {
  try {
    const perceptorLocations = await Localization.findAll({include: [{model: PerceptorLocation}]});
    res.status(200).json(perceptorLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPerceptorLocationById = async (req, res) => {
  try {
    const perceptorLocation = await PerceptorLocation.findByPk(req.params.id);
    if (!perceptorLocation) {
      return res.status(404).json({ error: 'PerceptorLocation not found' });
    }
    res.status(200).json(perceptorLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePerceptorLocation = async (req, res) => {
  try {
    const [updated] = await PerceptorLocation.update(req.body, {
      where: { perceptorLocation_id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'PerceptorLocation not found' });
    }
    res.status(200).json({ message: 'PerceptorLocation updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePerceptorLocation = async (req, res) => {
  try {
    const deleted = await PerceptorLocation.destroy({
      where: { perceptorLocation_id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'PerceptorLocation not found' });
    }
    res.status(200).json({ message: 'PerceptorLocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPerceptorLocationByPerceptorId = async (req, res) => {
    try {
      const perceptorLocations = await PerceptorLocation.findAll({
        where: { perceptor_id: req.body.perceptor_id }
      });
      res.status(200).json(perceptorLocations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { 
  createPerceptorLocation, 
  getAllPerceptorLocations, 
  getPerceptorLocationById, 
  updatePerceptorLocation, 
  deletePerceptorLocation,
  getPerceptorLocationByPerceptorId
};
