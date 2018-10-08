'use strict;'

// Get recipe info
function getRecipeInfo(recipeId) {
  recipeInfo = fetch('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + recipeId + '/information?includeNutrition=false', {
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
  })

  return recipeInfo
}

// Redirect to recipe URL
async function redirectToRecipe(recipeId) {
  recipeInfo = await getRecipeInfo(recipeId)
  window.location.replace(recipeInfo.sourceUrl)
}

// Find recipes by ingredients
function findRecipes() {
  // Grab variables from form input
  var listOfIngredients = document.getElementById('ingredientsInput').value.split(' ')
  var ranking = document.querySelector('input[name="ingredientsRanking"]:checked').value;
  var number = document.getElementById('numResults').value

  // Fetch recipes from Spoonacular API
  fetch('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=' + listOfIngredients + '&limitLicense=false&number=' + number + '&ranking=' + ranking, {
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
  }).then(function(json) {
    console.log(json)

    // Start HTML list for results
    var resultsHtml = '<ul>'

    // Loop over results and create list item for each
    for (var i = 0; i < json.length; i++) {
      resultsHtml += 
        '<li>' +
        '<a href="recipe.html?recipeId=' + json[i].id + '">' + json[i].title + '</a><br />' +
        '<img src="' + json[i].image + '">' +
        '</li>'
    }

    // Close HTML list and print to screen
    resultsHtml += '</ul>'
    document.getElementById('searchResults').innerHTML = resultsHtml
  })

  return false
}

// Display a recipe
async function showRecipe() {

  // Get recipe ID from URL parameter ('?recipeId=xxxxxx')
  let urlParams = new URLSearchParams(window.location.search);
  let recipeId = urlParams.get('recipeId');

  if (recipeId) {

    // Declare variables
    var recipeHtml = ''

    // Use recipe ID to get more info about the recipe
    recipeInfo = await getRecipeInfo(recipeId)
    console.log(recipeInfo)

    // Print recipe title
    document.getElementById('recipeHeader').innerHTML = 'Recipe for ' + recipeInfo.title

    // Print recipe image and caption with source
    recipeHtml +=
      '<img src="' + recipeInfo.image + '">' +
      '<div>Recipe brought to you by <a href="' + recipeInfo.sourceUrl + '">' +
      recipeInfo.sourceName + '</a></div>'

    // Loop over array of ingredients and make an unordered list
    recipeHtml += '<h3>Ingredients</h3><ul>'
    var ingredients = recipeInfo.extendedIngredients
    for (var i = 0; i < ingredients.length; i++) {
      let ingredient = ingredients[i].original
      recipeHtml += '<li>' + ingredient + '</li>'
    }
    recipeHtml += '</ul>'

    // Loop over array of recipe steps and make an ordered list
    recipeHtml += '<h3>Instructions</h3><ol>'
    if ( Array.isArray(recipeInfo.analyzedInstructions) && recipeInfo.analyzedInstructions.length ) {
      var steps = recipeInfo.analyzedInstructions[0].steps
      console.log(steps)
      for (var i = 0; i < steps.length; i++) {
        let stepObj = steps.find(obj => {
          console.log(obj)
          return obj.number === i + 1
        })
        recipeHtml += '<li>' + stepObj.step + '</li>'
      }
      recipeHtml += '</ol>'
    } else {
      recipeHtml +=
      '<div><a href="' + recipeInfo.sourceUrl + '">' +
      'Please visit ' + recipeInfo.sourceName +
      ' for the full recipe.</a></div>'
    }

    // Debug stuff
    //recipeHtml +=
    //  '<br /><br /><br /><br />' +
    //  JSON.stringify(recipeInfo)

    // Print recipe to screen
    document.getElementById('recipeDiv').innerHTML = recipeHtml

  } else {
    document.getElementById('recipeHeader').innerHTML = 'Recipe not found'
    document.getElementById('recipeDiv').innerHTML = '<a href="index.html">Please try again</a>'
  }
}
