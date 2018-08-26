'use strict'
let debug
// Uncomment to enable debug mode
// debug = true

// Define constants
const request = require('request')
const argv = require('yargs').argv
const headers = {
  'X-Mashape-Key': 'hRuyRnn7WTmshdd5VvMmTe9kvuJIp1RSE4Zjsncf3CDfSUWEmM',
  'Accept': 'application/json'
}

// Grab ingredients from the '-i' option on command line
let ingredients = argv.i || 'walnuts,pears'
let number = argv.n || 5

// Get a recipe ID from list of ingredients
let getRecipeIdByIngredients = function (ingredients, number, headers, callback) {
  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'

  let qs = {
    fillIngredients: false,
    ingredients: ingredients,
    limitLicense: false,
    number: number,
    ranking: 1
  }

  request({url: url, qs: qs, headers: headers}, function (err, res, body) {
    if (err) {
      console.log('error:', err); return
    } else if (res.statusCode !== 200) {
      console.log('error:', body); return
    }
    let recipes = JSON.parse(body)
    let recipeIds = []
    for (let r = 0; r < recipes.length; r++) {
      recipeIds.push(recipes[r].id)
    }
    callback(recipeIds)
  })
}

// Get recipe object from recipe ID
let getRecipeById = function (id, headers, callback) {
  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + id + '/information'

  let qs = {
    includeNutrition: false
  }

  request({url: url, qs: qs, headers: headers}, function (err, res, body) {
    if (err) {
      console.log('error:', err); return
    } else if (res.statusCode !== 200) {
      console.log('error:', body); return
    }
    let recipes = JSON.parse(body)
    callback(recipes)
  })
}

// let recipes = []

// Get Recipe ID
getRecipeIdByIngredients(ingredients, number, headers, function (recipeIds) {
  if (debug) console.log(recipeIds)

  for (let r = 0; r < recipeIds.length; r++) {
    getRecipeById(recipeIds[r], headers, function (recipeObject) {
      if (debug) console.log(recipeObject)
    })
  }
})
