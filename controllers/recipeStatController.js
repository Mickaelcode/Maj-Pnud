const getDailySumByRecipeType = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const dailyResults = {};

        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(startOfWeek);
            dayStart.setDate(startOfWeek.getDate() + i);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const results = await PayementHistory.findAll({
                attributes: [
                    [col("Recipe.recipe_type"), "recipe_type"],
                    [fn("SUM", col("PayementHistory.amount")), "total_amount"]
                ],
                include: [
                    {
                        model: Attribution,
                        attributes: [],
                        include: [
                            {
                                model: SubRecipe,
                                attributes: [],
                                include: [
                                    {
                                        model: Recipe,
                                        attributes: []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    date: {
                        [Op.between]: [dayStart, dayEnd]
                    }
                },
                group: ["Recipe.recipe_type"],
                raw: true
            });

            dailyResults[dayStart.toLocaleDateString("fr-FR", { weekday: "long" })] = formatResults(results);
        }

        res.status(200).json(dailyResults);
    } catch (error) {
        console.error("Error fetching daily sum:", error);
        res.status(500).json({ error: error.message });
    }
};

const getWeeklySumByRecipeType = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const results = await fetchSumByPeriod(startOfWeek, endOfWeek);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getMonthlySumByRecipeType = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const results = await fetchSumByPeriod(startOfMonth, endOfMonth);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getYearlySumByRecipeType = async (req, res) => {
    try {
        const today = new Date();
        const fiveYearsAgo = new Date(today.getFullYear() - 5, 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

        const results = await fetchSumByPeriod(fiveYearsAgo, endOfYear);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const fetchSumByPeriod = async (startDate, endDate) => {
    const results = await PayementHistory.findAll({
        attributes: [
            [col("Recipe.recipe_type"), "recipe_type"],
            [fn("SUM", col("PayementHistory.amount")), "total_amount"]
        ],
        include: [
            {
                model: Attribution,
                attributes: [],
                include: [
                    {
                        model: SubRecipe,
                        attributes: [],
                        include: [
                            {
                                model: Recipe,
                                attributes: []
                            }
                        ]
                    }
                ]
            }
        ],
        where: {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        group: ["Recipe.recipe_type"],
        raw: true
    });

    return formatResults(results);
};

const formatResults = (results) => {
    let formatted = { fiscal: 0, non_fiscal: 0, total: 0 };

    results.forEach((row) => {
        if (row.recipe_type === "fiscal") {
            formatted.fiscal = parseFloat(row.total_amount) || 0;
        } else if (row.recipe_type === "non fiscal") {
            formatted.non_fiscal = parseFloat(row.total_amount) || 0;
        }
        formatted.total += parseFloat(row.total_amount) || 0;
    });

    return formatted;
};

module.exports = { 
    getDailySumByRecipeType, 
    getWeeklySumByRecipeType, 
    getMonthlySumByRecipeType, 
    getYearlySumByRecipeType,
    fetchSumByPeriod
};