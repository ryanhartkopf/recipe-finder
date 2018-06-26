var request = require('request');

var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'

var headers = {
  'X-Mashape-Key': 'hRuyRnn7WTmshdd5VvMmTe9kvuJIp1RSE4Zjsncf3CDfSUWEmM',
  'Accept': 'application/json'
}

var qs = {
  fillIngredients: false,
  ingredients: 'walnuts,pears',
  limitLicense: false,
  number: 5,
  ranking: 1
}

request({url:url, qs:qs, headers:headers}, function(err, res, body) {
  if(err) {
    console.log('error:', err); return;
  } else if(res.statusCode != 200) {
    console.log('error:', body); return;
  }
  console.log(JSON.parse(body));
});
