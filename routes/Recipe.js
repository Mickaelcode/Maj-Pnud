const router = require('express').Router();
const { createRecipe, getRecipe, updateRecipe, deleteRecipe} = require('../controllers/Recipe')

router.post('/', createRecipe)
router.get('/', getRecipe)
router.put('/:id', updateRecipe)
router.delete('/:id', deleteRecipe)


module.exports = router