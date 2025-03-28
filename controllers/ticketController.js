const Ticket = require("../models/Ticket");
const SubRecipe = require("../models/subRecipe");
const Recipe = require('../models/Recipe')


exports.createTicket = async (req, res) => {

  let msg = "";
  try {
    const { matriculeCollector, matriculeCashier, subRecipe_id, isSolde } =
      req.body;
    const ticketData = {
      matriculeCollector,
      matriculeCashier,
      subRecipe_id,
    };
    if (isSolde) ticketData.isSolde = isSolde
    const ticket = await Ticket.create(ticketData);
    if (!ticket) {
      msg = "have issue on your request";
      res.status(401).json({ msg });
      return;
    }
    msg = "Ticket created succesfully";
    res.status(200).json({ msg, ticket });
  } catch (error) {
    msg = "Server error!";
    res.status(500).json({ msg: error.message ?? msg });
  }
};

exports.getAllTickets = async (req, res) => {

  let msg = "";
  try {
    const tickets = await Ticket.findAll({
      include: [{model: SubRecipe, include: [{model: Recipe}]}]
    });
    if (tickets == null) {
      msg = "have issue on your request";
      res.status(401).json({ msg });
      return;
    }
    msg = tickets ? `lists of tickets:${tickets.length}` : "Empty";
    res.status(200).json({ msg, tickets });
  } catch (error) {
    msg = "Server error!";
    res.status(500).json({ msg: error.message ?? msg });
  }
};

exports.getTicketById = async (req, res) => {

  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {include: [{model: SubRecipe, include: [{model: Recipe}]}]});
    if (!ticket) {
      msg = "ticket not found";
      res.status(404).json({ msg });
      return;
    }
    msg = `ticket id:${id}`;
    res.status(200).json({ msg, ticket });
  } catch (error) {
    msg = "Server error!";
    res.status(500).json({ msg: error.message ?? msg });
  }
};

exports.updateTicket = async (req, res) => {

  try {
    const { id } = req.params;
    const { matriculeCollector, matriculeCashier, subRecipe_id, isSolde } =
      req.body;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      msg = "ticket not found";
      res.status(404).json({ msg });
      return;
    }
    await ticket.update({
      matriculeCollector,
      matriculeCashier,
      subRecipe_id,
      isSolde,
    });
    msg = `ticket ${id} update succesfully`;
    res.status(200).json({ msg, ticket });
  } catch (error) {
    msg = "Server error!";
    res.status(500).json({ msg: error.message ?? msg });
  }
};

exports.deleteTicket = async (req, res) => {

  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      msg = "ticket not found";
      res.status(404).json({ msg });
      return;
    }
    await ticket.destroy();
    msg = `ticket(${id}) deleted succesfully`;
    res.status(200).json({ msg });
  } catch (error) {
    msg = "Server error!";
    res.status(500).json({ msg: error.message ?? msg });
  }
};

exports.getSoldRecipeValueByDateAndType = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const totals = await Ticket.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('SubRecipe.price')), 'total'],
        'Recipe.recipe_type',
      ],
      where: {
        isSolde: true,
        dateSale: {
          [Op.gte]: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
          [Op.lte]: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
        },
      },
      include: [
        {
          model: SubRecipe,
          attributes: [],
          include: [
            {
              model: Recipe,
              attributes: ['recipe_type'],
            },
          ],
        },
      ],
      group: ['Recipe.recipe_type'],
      raw: true,
    });

    res.status(200).json(totals);
  } catch (error) {
    console.error('Error getting total sold recipe value by type:', error);
    res.status(500).json({ message: error.message });
  }
};


exports.returnTicket = async (req, res) => {
  try {
    const { ticketNum } = req.body;

    if (!ticketNum || !Array.isArray(ticketNum) || ticketNum.length === 0) {
      return res.status(400).json({ message: 'Invalid ticket numbers.' });
    }

    const updatedTickets = [];
    for (const ticketId of ticketNum) {
      const ticket = await Ticket.findByPk(ticketId);
      if (ticket) {
        ticket.isSolde = true;
        ticket.dateSale = new Date();
        await ticket.save();
        updatedTickets.push(ticket);
      }
    }

    res.status(200).json(updatedTickets);
  } catch (error) {
    console.error('Error returning tickets:', error);
    res.status(500).json({ message: error.message });
  }
};
