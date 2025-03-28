const Localization = require('../models/Localization');

const createLocalization = async (req, res) => {
    const { venue, indication_zone } = req.body
    console.log(venue)
    try {
        const newLocalization = await Localization.create({
            venue,
            indication_zone
        });
        res.status(201).json(newLocalization);
    } catch (error) {
        console.error("Error creating localization:", error);
        res.status(500).json({ error: "Server error while creating localization" });
    }
};

const getAllLocalizations = async (req, res) => {
    try {
        const localizations = await Localization.findAll();
        const data = {}
        localizations.forEach(element => {
            if (!data.hasOwnProperty(element.venue)) {
                data[element.venue] =[ {localizations_id : element.localization_id, zone: element.indication_zone }]
            } else {
                data[element.venue].push({localizations_id : element.localization_id, zone: element.indication_zone })
            }
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error retrieving localizations:", error);
        res.status(500).json({ error: "Server error while retrieving localizations" });
    }
};


const getLocalizationById = async (req, res) => {
    const { id } = req.params;
    try {
        const localization = await Localization.findByPk(id);
        if (!localization) {
            return res.status(404).json({ error: "Localization not found" });
        }
        res.status(200).json(localization);
    } catch (error) {
        console.error("Error retrieving localization:", error);
        res.status(500).json({ error: "Server error while retrieving localization" });
    }
};


const updateLocalization = async (req, res) => {
    const { id } = req.params;
    const { venue, indication_zone } = req.body;
    try {
        const localization = await Localization.findByPk(id);
        if (!localization) {
            return res.status(404).json({ error: "Localization not found" });
        }
        localization.venue = venue || localization.venue;
        localization.indication_zone = indication_zone || localization.indication_zone;
        await localization.save();
        res.status(200).json(localization);
    } catch (error) {
        console.error("Error updating localization:", error);
        res.status(500).json({ error: "Server error while updating localization" });
    }
};


const deleteLocalization = async (req, res) => {
    const { id } = req.params;
    try {
        const localization = await Localization.findByPk(id);
        if (!localization) {
            return res.status(404).json({ error: "Localization not found" });
        }
        await localization.destroy();

        res.status(200).json({ message: "Localization successfully deleted" });
    } catch (error) {
        console.error("Error deleting localization:", error);
        res.status(500).json({ error: "Server error while deleting localization" });
    }
};

module.exports = {createLocalization, getAllLocalizations, getLocalizationById, updateLocalization, deleteLocalization }
