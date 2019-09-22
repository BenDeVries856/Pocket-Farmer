
var seconds = 1000;
var minutes = seconds * 60;
var hours = minutes * 60;

// object for each of the animals
var COW = {
	'name': 'cow',
	'type': 'animal',
	'produce': ['milk', 'horns', 'leather'],
	'minYield': 1,
	'maxYield': 2,
	'xp': 10,
	'wait': 10 * minutes,
	'locked': false,
  'price':100,
  'cost': {},
	'seed': false,
	'buy': true,
	'upgrade': 'dairy_cow'
}

var DAIRY_COW = {
	'name': 'dairy_cow',
	'type': 'animal',
	'produce': ['milk', 'horns', 'leather'],
	'minYield': 10,
	'maxYield': 12,
	'xp': 50,
	'wait': 30 * minutes,
  'price': 500,
	'seed': false,
	'buy': false,
	'upgrade': 'angus_cow'
}

var ANGUS_COW = {
	'name': 'angus_cow',
	'type': 'animal',
	'produce': ['milk', 'horns', 'leather'],
	'minYield': 35,
	'maxYield': 55,
	'xp': 100,
	'wait': 5 * hours,
  'price': 1000,
	'seed': false,
	'buy': false,
	'upgrade': false
}

var SHEEP = {
	'name': 'sheep',
	'type': 'animal',
	'produce': ['wool', 'horns'],
	'minYield': 1,
	'maxYield': 3,
	'xp': 10,
	'wait': 10 * minutes,
	'locked': false,
    'price': 100,
    'cost': {},
		'seed': false,
		'buy': true,
		'upgrade': 'black_sheep'
}

var BLACK_SHEEP = {
	'name': 'black_sheep',
	'type': 'animal',
	'produce': ['wool', 'horns'],
	'minYield': 12,
	'maxYield': 15,
	'xp': 50,
	'wait': 30 * minutes,
  'price': 500,
	'seed': false,
	'buy': false,
	'upgrade': 'scottish_blackface'
}

var SCOTTISH_BLACKFACE = {
	'name': 'scottish_blackface',
	'type': 'animal',
	'produce': ['wool', 'horns'],
	'minYield': 45,
	'maxYield': 60,
	'xp': 100,
	'wait': 5 * hours,
  'price': 1000,
	'seed': false,
	'buy': false,
	'upgrade': false
}

var CHICKEN = {
	'name': 'chicken',
	'type': 'animal',
	'produce': ['egg', 'feather'],
	'minYield': 1,
	'maxYield': 3,
	'xp': 10,
	'wait': 10 * minutes,
	'locked': false,
    'price': 100,
    'cost': {},
		'seed': false,
		'buy': true,
		'upgrade': 'plymouth_chicken'
}

var PLYMOUTH_CHICKEN = {
	'name': 'plymouth_chicken',
	'type': 'animal',
	'produce': ['egg', 'feather'],
	'minYield': 10,
	'maxYield': 15,
	'xp': 50,
	'wait': 30 * minutes,
  'price': 500,
	'seed': false,
	'buy': false,
	'upgrade': 'silkie_chicken'
}

var SILKIE_CHICKEN = {
	'name': 'silkie_chicken',
	'type': 'animal',
	'produce': ['egg', 'feather'],
	'minYield': 45,
	'maxYield': 60,
	'xp': 100,
	'wait': 5 * hours,
  'price': 700,
	'seed': false,
	'buy': false,
	'upgrade': false
}

var GOAT = {
	'name': 'goat',
	'type': 'animal',
	'produce': ['milk'],
	'wait': 30 * minutes,
	'minYield': 14,
	'maxYield': 18,
	'xp': 50,
	'locked': false,
    'price': 500,
    'cost': {
        'milk': 5,
        'horns': 15,
        'wool': 5
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var PIG = {
	'name': 'pig',
	'type': 'animal',
	'produce': ['pork', 'manuer'],
	'minYield': 12,
	'maxYield': 16,
	'xp': 50,
	'wait': 30 * minutes,
	'locked': false,
    'price': 500,
    'cost': {
        'leather': 15,
        'corn': 5,
        'straw': 5
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var DUCK = {
	'name': 'duck',
	'type': 'animal',
	'produce': ['egg'],
	'minYield': 10,
	'maxYield': 20,
	'xp': 50,
	'wait': 30 * minutes,
	'locked': false,
    'price': 500,
    'cost': {
        'feather': 15,
        'egg': 10
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var HORSE = {
	'name': 'horse',
	'type': 'animal',
	'produce': ['horseshoe', 'glue'],
	'minYield': 50,
	'maxYield': 60,
	'xp': 100,
	'wait': 3 * hours,
	'locked': false,
    'price': 1500,
    'cost': {
        'leather': 100,
        'hay': 50
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var DEER = {
	'name': 'deer',
	'type': 'animal',
	'produce': ['venison', 'antlers'],
	'minYield': 50,
	'maxYield': 60,
	'xp': 100,
	'wait': 3 * hours,
	'locked': false,
    'price': 1500,
    'cost': {
        'apple': 100,
        'grass': 50
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var RABBIT = {
	'name': 'rabbit',
	'type': 'animal',
	'produce': ['luckyfoot', 'rabbit'],
	'minYield': 50,
	'maxYield': 60,
	'xp': 100,
	'wait': 3 * hours,
	'locked': false,
    'price': 1500,
    'cost': {
        'carrot': 150
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var ALPACA = {
	'name': 'alpaca',
	'type': 'animal',
	'produce': ['alpacawool'],
	'minYield': 100,
	'maxYield': 130,
	'xp': 175,
	'wait': 6 * hours,
	'locked': false,
    'price': 2000,
    'cost': {
        'mountaingrass': 150,
				'wool': 200
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var TURKEY = {
	'name': 'turkey',
	'type': 'animal',
	'produce': ['turkeyegg', 'talons'],
	'minYield': 100,
	'maxYield': 130,
	'xp': 175,
	'wait': 6 * hours,
	'locked': false,
    'price': 2000,
    'cost': {
        'wildberries': 150,
				'egg': 200
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

var BEES = {
	'name': 'bees',
	'type': 'animal',
	'produce': ['honey', 'honeycomb'],
	'minYield': 100,
	'maxYield': 130,
	'xp': 175,
	'wait': 6 * hours,
	'locked': false,
    'price': 2000,
    'cost': {
        'sugar': 125,
				'tulips': 125
    },
		'seed': false,
		'buy': true,
		'upgrade': false
}

// object for each auxilary animal
var CORGI = {
	'name': 'corgi',
	'type': 'animal',
	'aux': true,
	'locked': false,
  'price': 800,
	'xp': 200,
	'lvl': 5,
	'seed': false,
	'buy': true,
	'upgrade': false,
	'multiplier': 0.9
}

var BORDER_COLLIE = {
	'name': 'border_collie',
	'type': 'animal',
	'aux': true,
	'locked': false,
  'price': 800,
	'xp': 200,
	'lvl': 5,
	'seed': false,
	'buy': true,
	'upgrade': false,
	'multiplier': 0.9
}

var GREAT_PYRENEES = {
	'name': 'great_pyrenees',
	'type': 'animal',
	'aux': true,
	'locked': false,
  'price': 1000,
	'xp': 250,
	'lvl': 10,
	'seed': false,
	'buy': true,
	'upgrade': false,
	'multiplier': 0.8
}

var DONKEY = {
	'name': 'donkey',
	'type': 'animal',
	'aux': true,
	'locked': false,
  'price': 1500,
	'xp': 300,
	'lvl': 10,
	'seed': false,
	'buy': true,
	'upgrade': false,
	'multiplier': 0.7
}

// object for each of the plants
var WHEAT = {
	'name': 'wheat',
	'type': 'plant',
	'produce': ['straw', 'wheat', 'barley'],
	'minYield': 7,
	'maxYield': 11,
	'xp': 10,
	'lvl': 1,
	'wait': 25 * minutes,
	'locked': false,
	'price': 25,
  'cost': false,
	'seed': 'wheatseed',
	'buy': true
}

var CORN = {
	'name': 'corn',
	'type': 'plant',
	'produce': ['corn'],
	'minYield': 7,
	'maxYield': 11,
	'xp': 10,
	'lvl': 1,
	'wait': 25 * minutes,
	'locked': false,
  'price': 25,
  'cost': false,
	'seed': 'cornseed',
	'buy': true
}

var OATS = {
	'name': 'oats',
	'type': 'plant',
	'produce': ['hay', 'oats', 'grass'],
	'minYield': 3,
	'maxYield': 6,
	'xp': 10,
	'lvl': 1,
	'wait': 25 * minutes,
	'locked': false,
  'price': 25,
  'cost': false,
	'seed': 'oatseed',
	'buy': true
}

var POTATOES = {
	'name': 'potatoes',
	'type': 'plant',
	'produce': ['potatoes'],
	'minYield': 15,
	'maxYield': 18,
	'xp': 50,
	'lvl': 5,
	'wait': 1 * hours,
	'locked': true,
  'price': 60,
  'cost': false,
	'seed': 'potatoes',
	'buy': true
}

var BEANS = {
	'name': 'beans',
	'type': 'plant',
	'produce': ['beans'],
	'minYield': 12,
	'maxYield': 19,
	'xp': 50,
	'lvl': 5,
	'wait': 1 * hours,
	'locked': true,
  'price': 60,
  'cost': false,
	'seed': 'beans',
	'buy': true
}

var RICE = {
	'name': 'rice',
	'type': 'plant',
	'produce': ['rice'],
	'minYield': 12,
	'maxYield': 19,
	'xp': 50,
	'lvl': 5,
	'wait': 1 * hours,
	'locked': true,
  'price': 60,
  'cost': false,
	'seed': 'riceseed',
	'buy': true
}

var CARROT = {
	'name': 'carrot',
	'type': 'plant',
	'produce': ['carrot'],
	'minYield': 25,
	'maxYield': 30,
	'xp': 100,
	'lvl': 10,
	'wait': 5 * hours,
	'locked': true,
  'price': 75,
  'cost': false,
	'seed': 'carrot',
	'buy': true
}

var APPLE = {
	'name': 'apple',
	'type': 'plant',
	'produce': ['apple', 'stick'],
	'minYield': 20,
	'maxYield': 27,
	'xp': 100,
	'lvl': 10,
	'wait': 5 * hours,
	'locked': true,
  'price': 75,
  'cost': false,
	'seed': 'appleseed',
	'buy': true
}

var TOMATO = {
	'name': 'tomato',
	'type': 'plant',
	'produce': ['tomato'],
	'minYield': 25,
	'maxYield': 30,
	'xp': 100,
	'lvl': 10,
	'wait': 5 * hours,
	'locked': true,
  'price': 75,
  'cost': false,
	'seed': 'tomatoseed',
	'buy': true
}

var MOUNTAIN_GRASS = {
	'name': 'mountain_grass',
	'type': 'plant',
	'produce': ['mountaingrass'],
	'minYield': 45,
	'maxYield': 55,
	'xp': 225,
	'lvl': 15,
	'wait': 10 * hours,
	'locked': true,
  'price': 200,
  'cost': false,
	'seed': 'mountainseed',
	'buy': true
}

var WILD_BERRIES = {
	'name': 'wild_berries',
	'type': 'plant',
	'produce': ['wildberries'],
	'minYield': 45,
	'maxYield': 55,
	'xp': 225,
	'lvl': 15,
	'wait': 10 * hours,
	'locked': true,
  'price': 200,
  'cost': false,
	'seed': 'wildberries',
	'buy': true
}

var TULIPS = {
	'name': 'tulips',
	'type': 'plant',
	'produce': ['tulip'],
	'minYield': 45,
	'maxYield': 55,
	'xp': 225,
	'lvl': 15,
	'wait': 10 * hours,
	'locked': true,
  'price': 200,
  'cost': false,
	'seed': 'tulipseed',
	'buy': true
}

var EXTRA = {

}

// animal crafting recipes
var GOAT_RECIPE = {
	'type': 'animal',
	'input': ['wool', 'horns', 'milk'],
	'output': 'goat'
}

var PIG_RECIPE = {
	'type': 'animal',
	'input': ['leather', 'corn', 'straw'],
	'output': 'pig'
}

var DUCK_RECIPE = {
	'type': 'animal',
	'input': ['water', 'feather', 'egg'],
	'output': 'duck'
}

var HORSE_RECIPE = {
	'type': 'animal',
	'input': ['hay', 'carrot', 'oats'],
	'output': 'horse'
}

var DEER_RECIPE = {
	'type': 'animal',
	'input': ['apple', 'grass', 'horns'],
	'output': 'deer'
}

var RABBIT_RECIPE = {
	'type': 'animal',
	'input': ['carrot', 'tomato'],
	'output': 'rabbit'
}

var ALPACA_RECIPE = {
	'type': 'animal',
	'input': ['wool', 'mountaingrass', 'horseshoe'],
	'output': 'alpaca'
}

var TURKEY_RECIPE = {
	'type': 'animal',
	'input': ['feather', 'egg', 'wildberries'],
	'output': 'turkey'
}

var BEES_RECIPE = {
	'type': 'animal',
	'input': ['tulip', 'sugar'],
	'output': 'bees'
}

// item crafting recipes
var PILLOW_RECIPE = {
	'type': 'item',
	'input': ['feather', 'feather', 'wool'],
	'output': 'pillow'
}

var BEER_RECIPE = {
	'type': 'item',
	'input': ['barley', 'water'],
	'output': 'beer'
}

var CIDER_RECIPE = {
	'type': 'item',
	'input': ['barley', 'water', 'apple'],
	'output': 'cider'
}

var VODKA_RECIPE = {
	'type': 'item',
	'input': ['water', 'potatoes'],
	'output': 'vodka'
}

var WHISKEY_RECIPE = {
	'type': 'item',
	'input': ['barley', 'corn', 'water'],
	'output': 'whiskey'
}

var DEATHCUP_RECIPE = {
	'type': 'item',
	'input': ['whiskey', 'vodka', 'beer'],
	'output': 'deathcup'
}

var KETCHUP_RECIPE = {
	'type': 'item',
	'input': ['tomato', 'water'],
	'output': 'ketchup',
}

var BREAD_RECIPE = {
	'type': 'item',
	'input': ['water', 'wheat', 'oats'],
	'output': 'bread'
}

var SUGAR_RECIPE = {
	'type': 'item',
	'input': ['wildberries'],
	'outut': 'sugar'
}

var WINE_RECIPE = {
	'type': 'item',
	'input': ['wildberries', 'water', 'sugar'],
	'output': 'wine'
}

var GLOBAL_ANIMALS =
			// animals
		 [COW, DAIRY_COW, ANGUS_COW, SHEEP, BLACK_SHEEP, SCOTTISH_BLACKFACE, CHICKEN, PLYMOUTH_CHICKEN, SILKIE_CHICKEN,
		  GOAT, PIG, DUCK, HORSE, DEER, RABBIT, ALPACA, TURKEY, BEES,
			// auxilary's
			CORGI, BORDER_COLLIE, GREAT_PYRENEES, DONKEY,
			// plants
			WHEAT, CORN, OATS, POTATOES, BEANS, RICE, CARROT, APPLE, TOMATO, MOUNTAIN_GRASS, WILD_BERRIES, TULIPS];

var GLOBAL_WAIT_TIMES = [0, 0, 1 * minutes, 5 * minutes, 15 * minutes, 30 * minutes, 1 * hours,
	 												5 * hours, 14 * hours, 24 * hours];
var GLOBAL_ROOM_PRICES = [0, 0, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000, 10000000];
var GLOBAL_XP = [0, 50, 75, 105, 150, 200, 300, 500, 750, 1000, 1250, 1500, 1750, 2000, 3000, 4000, 5000, 6000,
								7000, 8000, 9000, 10000, 12500, 15000, 25000, 50000, 75000, 100000, 125000, 150000, 175000, 200000];

// an array to hold all the items
var GLOBAL_ITEMS = ['water', 'milk', 'leather', 'horns', 'feather', 'egg', 'wool',
										'straw', 'corn', 'hay', 'oats', 'manuer', 'pork', 'rice', 'potatoes', 'beans',
										'horseshoe', 'glue', 'pillow', 'carrot', 'apple', 'tomato', 'grass', 'antlers',
										'venison', 'luckyfoot', 'rabbit', 'barley', 'beer', 'cider', 'vodka', 'whiskey',
										'garbage', 'stick', 'ketchup', 'wheat', 'bread', 'mountaingrass', 'wildberries',
										'tulip', 'alpacawool', 'turkeyegg', 'talons', 'sugar', 'wine', 'honey', 'honeycomb'];

var GLOBAL_ITEM_PRICES = [0, 3, 5, 3, 2, 3, 4,
	 												7, 6, 4, 6, 6, 5, 15, 17, 18,
												  13, 12, 16, 20, 22, 21, 1, 7,
													6, 7, 6, 2, 20, 25, 35, 35,
													0, 2, 5, 6, 10, 20, 19,
													22, 32, 32, 33, 25, 35, 30, 30];

var GLOBAL_RECIPES = [GOAT_RECIPE, PIG_RECIPE, DUCK_RECIPE, HORSE_RECIPE, PILLOW_RECIPE, DEER_RECIPE,
	 										RABBIT_RECIPE, BEER_RECIPE, CIDER_RECIPE, VODKA_RECIPE, WHISKEY_RECIPE,
											KETCHUP_RECIPE, BREAD_RECIPE, ALPACA_RECIPE, TURKEY_RECIPE, BEES_RECIPE];

/** some useful functions **/
function orderItems(items){
	var sorted = [];
	for(var i = 0; i < GLOBAL_ITEMS.length; i++){
		for(var j = 0; j < items.length; j++){
			if(items[j] == GLOBAL_ITEMS[i]){
				sorted.push(items[j]);
			}
		}
	}
	if(sorted.length != items.length){
		return items;
	} else {
		return sorted;
	}
}
