const express = require("express")
const cors = require("cors");
const mainRoutes = require("./routes/main")
const Recipe = require("./models/Recipe")
const SubRecipe = require("./models/subRecipe")
const Attribution = require("./models/Attribution")
const PayementHistory = require("./models/PayementHistory")
const Localization = require("./models/Localization")
const PerceptorLocation = require("./models/PerceptorLocation")
const Ticket = require("./models/PerceptorLocation")
const sequelize = require("./config/sequelize")

const app = express()
app.use(cors())
app.use(express.json())

app.use('/servicerecette', mainRoutes)

const q = async() => {
    if(sequelize) {
         Recipe.sync()
         SubRecipe.sync()
         Attribution.sync()
         PayementHistory.sync()
         Localization.sync()
         PerceptorLocation.sync()
         Ticket.sync()
    }
}
//;q()


const PORT = process.env.SERVER_PORT || 3000
//const IP = "192.168.43.127"
app.listen(PORT, () => {
    console.log(`Serveur is running on http://localhost:${PORT}`);
});
