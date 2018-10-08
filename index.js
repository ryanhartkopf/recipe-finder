'use strict;'

const apiKey = 'hRuyRnn7WTmshdd5VvMmTe9kvuJIp1RSE4Zjsncf3CDfSUWEmM'

// Get recipe URL
function getRecipeUrl(recipeId) {
  recipeUrl = fetch('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + recipeId + '/information?includeNutrition=false', {
    method: 'GET',
    headers: new Headers({
    	'X-Mashape-Key': apiKey,
    	'Accept': 'application/json'
    })
  }).then(function(response) {
    console.log(response)

    if ( response.ok === true ) {
      return response.json()
    } else {
      return null
    }
  }).then(function(json) {
    console.log(json)
    return json.sourceUrl
  })

  return recipeUrl
}

// Find recipes by ingredients
function findRecipes() {
  // Grab list of ingredients from form input
  var listOfIngredients = document.getElementById('ingredientsInput').value.split(' ')

  // Fetch recipes from Spoonacular API
  fetch('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=' + listOfIngredients + '&limitLicense=false&number=5&ranking=1', {
    method: 'GET',
    headers: new Headers({
    	'X-Mashape-Key': apiKey,
    	'Accept': 'application/json'
    })
  }).then(function(response) {
    console.log(response)

    // Print the search terms
    document.getElementById('searchTerms').innerHTML = 'You searched for: ' + listOfIngredients

    if ( response.ok === true ) {
      // If we get a 200-299 code, return results
      return response.json()
    } else {
      // If we get any other code, respond with error code and text
      document.getElementById('searchResults').innerHTML = response.status + ' ' + response.statusText
    }
  }).then(async function(json) {
    console.log(json)
    var resultsHtml = ''
    for (var i = 0; i < json.length; i++) {
      recipeUrl = await getRecipeUrl(json[i].id)
      resultsHtml += 
        '<ul>' +
        '<li>' +
        '<a href="' + recipeUrl + '">' + json[i].title + '</a><br />' +
        '<img src="' + json[i].image + '">' +
        '</li>' +
        '</ul>'
    }
    document.getElementById('searchResults').innerHTML = resultsHtml
  })
}

// Detect ingredients form submission
document.getElementById('ingredientsForm').onsubmit = function() {findRecipes()}
