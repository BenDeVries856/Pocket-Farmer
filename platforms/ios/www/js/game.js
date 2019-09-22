
// reference "static" variables
var screenWidth = screen.width;
var screenHeight = screen.height;
var btnWidth = screenWidth / 5;
var btnHeight = screenHeight / 17;
var roomWidth = 300;
var roomHeight = 75;

// database variable
var db;

// global variables
var rooms = [];
var invAnimals = [];
var invItems = [];
var invSeeds = [];
var floorDrops = [];
var money;
var activeRoom = false;
var craftBench;
var experience;
var pause = false;
var speed = 1;
var firstPlay = true;

var time;

// whenever a menu is opened this function disables the background and focuses the menu
function roomClicked(room, menu){
  activeRoom = room;
  if(room != false){
    if(room.type == 'buy'){
      buyRoom(room);
      return;
    } else if(room.type == 'pasture'){
      displayInvAnimals(false);
      $('#floormenu').show();
      menu = '#floormenu';
      $('#room-title h2').html('Pasture');
    } else if(room.type == 'field'){
      displayInvAnimals(true);
      $('#ranimals1').addClass('hidden');
      $('#ranimals3').addClass('hidden');
      $('#upgrade-slot').addClass('hidden');
      $('#floormenu').show();
      menu = '#floormenu';
      $('#room-title h2').html('Field');
    }
  } else {
    if(menu == '#craftmenu'){
      displayInvItems()
    }
    $(menu).show();
  }
  removeClicks();
  $(document).off('click');
  setTimeout(function(){
    $(document).on('click', function(){
      if((!$(event.target).is(menu) && !$(event.target).parents(menu).is(menu)
          && !$(event.target).is('.inner-slot')) || $(event.target).is('#tut-close'))
        {
          if(menu == '#craftmenu'){
            // removes all items currently in the crafting slot
            for(var i = 0; i < 3; i++){
              var item = craftBench.getItem(i + 1);
              if(item != 'none'){
                invItems.push(item);
                craftBench.removeItem(i + 1);
              }
            }
          // resetting to animals tab
          } else if(menu == '#buymenu'){
            $('#animals-tab').removeClass('animaltab-inactive');
            $('#animals-tab').addClass('animaltab-active');
            $('#plants-tab').removeClass('planttab-active');
            $('#plants-tab').addClass('planttab-inactive');
            $('#auxilary-tab').removeClass('auxilarytab-active');
            $('#auxilary-tab').addClass('auxilarytab-inactive');
          }
          activeRoom = false;
          addClicks();
          $(menu).hide();
          $('#ranimals1').removeClass('hidden');
          $('#ranimals3').removeClass('hidden');
          $('#upgrade-slot').removeClass('hidden');
          toggleFooter('hide');
          footerShown = false;
          $(document).off('click');
        }
    });
  }, 100);
}

// function buys the lowest room
function buyRoom(room){
  var popupHTML = '<div class="choice-pasture" active="true">Pasture</div><br>' +
                  '<div class="choice-field"   active="false">Field</div>';
  var verify = new Popup('buyroom', popupHTML, true, function(){
    $('.choice-pasture').addClass('active');
    $('.choice-pasture').css({
      'background-image': 'url("img/menu/pastureselection.png")',
      'background-size': '100% 100%',
      'image-rendering': 'pixelated',
      'width': '80%',
      'margin-top': '20%',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'padding-top': '5%',
      'padding-bottom': '5%'
    }).click(function(){
      $(this).attr('active', 'true');
      $(this).addClass('active');
      $('.choice-field').attr('active', 'false');
      $('.choice-field').removeClass('active');
    });
    $('.choice-field').css({
      'background-image': 'url("img/menu/fieldselection.png")',
      'background-size': '100% 100%',
      'image-rendering': 'pixelated',
      'width': '80%',
      'margin-top': '5%',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'height': '200%',
      'padding-top': '5%',
      'padding-bottom': '5%'
    }).click(function(){
      $(this).attr('active', 'true');
      $(this).addClass('active');
      $('.choice-pasture').attr('active', 'false');
      $('.choice-pasture').removeClass('active');
    });
  }, function(){
    var active = 'pasture';
    if($('.choice-pasture').attr('active') == 'true'){
      active = 'pasture';
    } else if($('.choice-field').attr('active') == 'true'){
      active = 'field';
    }
    // money transaction
    if(money < room.price){
      var popup = new Popup('funds', "Insufficient funds", false);
      return;
    } else {
      money -= room.price;
      var popup = new Popup('room', active + ' bought', false);
    }
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].z == room.z){
        $('#' + rooms[i].id).remove();
        rooms[i] = new Room(room.z, active);
      }
    }
    var z = rooms[rooms.length - 1].z + 1;
    var newroom = new Room(z, 'buy');
    addRoom(newroom);
  });
}

function addRoom(room){
  if(room.z * roomHeight > screenHeight){
    $('html, body').css('height', room.z * roomHeight);
  }
  rooms.push(room);
}

// function buys the animal passed to it
function buyAnimal(type, animal) {
    var cost = {};
    for (var i = 0; i < GLOBAL_ANIMALS.length; i++) {
        if (animal.type == GLOBAL_ANIMALS[i].name) {
            cost = GLOBAL_ANIMALS[i].cost;
        }
    }
    var sufficientItems = true;
    for (var prop in cost) {
        var num = cost[prop];
        var inInv = false;
        for (var i = 0; i < invItems.length; i++) {
            if (invItems[i].name == prop) {
                if (invItems[i].num >= num){
                    inInv = true;
                }
            } else {
            }
        }
        if (!inInv) {
            sufficientItems = false;
        }
    }
    if (money < animal.price || !sufficientItems) {
      $('#animals-tab').removeClass('animaltab-inactive');
      $('#animals-tab').addClass('animaltab-active');
      $('#plants-tab').removeClass('planttab-active');
      $('#plants-tab').addClass('planttab-inactive');
      $('#auxilary-tab').removeClass('auxilarytab-active');
      $('#auxilary-tab').addClass('auxilarytab-inactive');
        var popup = new Popup('funds', "Insufficient funds", false, function(){}, function(){
          roomClicked(false, '#buymenu');
        });
        return;
    } else {
        money -= animal.price;
        for (var prop in cost) {
            for (var i = 0; i < invItems.length; i++) {
                if (invItems[i].name == prop) {
                    for (var j = 0; j < cost[prop]; j++) {
                        invItems[i].removeItem();
                    }
                }
            }
        }
        $('#animals-tab').removeClass('animaltab-inactive');
        $('#animals-tab').addClass('animaltab-active');
        $('#plants-tab').removeClass('planttab-active');
        $('#plants-tab').addClass('planttab-inactive');
        $('#auxilary-tab').removeClass('auxilarytab-active');
        $('#auxilary-tab').addClass('auxilarytab-inactive');
        var popup = new Popup('animal', 'Purchased ' + formatText(animal.type) + ' for $' + animal.price,
                              false, function(){}, function(){
          roomClicked(false, '#buymenu');
        });
    }
    if(type == 'animal' || type == 'auxilary'){
      addToInv('animal', animal);
    } else {
      addToInv('plant', animal);
    }
}

// add clicks back to main game after exiting a menu
footerShown = false;
function addClicks(){
  for(var i = 0; i < rooms.length; i++){
    $('#' + rooms[i].id).removeClass('active');
  }
  removeClicks();
  $('#buy-button').off('click').on('click', function(){
    roomClicked(false, '#buymenu');
    addBuyAnimals('animal', 1);
  });
  $('#craft-button').off('click').on('click', function(){
    roomClicked(false, '#craftmenu');
  });
  $('#save-button').off('click').on('click', function(){
    saveData();
  });
  $('#footer-toggle').off('click').on('click', function(){
    if(footerShown){
      footerShown = false;
      toggleFooter('hide');
    } else {
      footerShown = true;
      toggleFooter('show');
    }
  });
  for(var i = 0; i < rooms.length; i++){
    $('#room' + (i + 1)).off('click').on('click', function(){
      var index = parseInt($(this).attr('z')) - 1;
      $('#' + rooms[index].id).addClass('active');
      roomClicked(rooms[index]);
    });
  }
  $('#room-next').off('click').on('click', function(){
    if(activeRoom.type == 'pasture'){
      invAnimals = invNextPage(invAnimals, 4);
      displayInvAnimals(false);
    } else if(activeRoom.type == 'field'){
      invSeeds = invNextPage(invSeeds, 4);
      displayInvAnimals(true);
    }
  });
  $('#craft-next').off('click').on('click', function(){
    invItems = invNextPage(invItems, 9);
    displayInvItems();
  });
  $('#animals-tab').off('click').on('click', function(){
    $(this).removeClass('animaltab-inactive');
    $(this).addClass('animaltab-active');
    $('#plants-tab').removeClass('planttab-active');
    $('#plants-tab').addClass('planttab-inactive');
    $('#auxilary-tab').removeClass('auxilarytab-active');
    $('#auxilary-tab').addClass('auxilarytab-inactive');
    addBuyAnimals('animal', 1);
  });
  $('#plants-tab').off('click').on('click', function(){
    $(this).removeClass('planttab-inactive');
    $(this).addClass('planttab-active');
    $('#animals-tab').removeClass('animaltab-active');
    $('#animals-tab').addClass('animaltab-inactive');
    $('#auxilary-tab').removeClass('auxilarytab-active');
    $('#auxilary-tab').addClass('auxilarytab-inactive');
    addBuyAnimals('plant', 1);
  });
  $('#auxilary-tab').off('click').on('click', function(){
    $(this).removeClass('auxilarytab-inactive');
    $(this).addClass('auxilarytab-active');
    $('#animals-tab').removeClass('animaltab-active');
    $('#animals-tab').addClass('animaltab-inactive');
    $('#plants-tab').removeClass('planttab-active');
    $('#plants-tab').addClass('planttab-inactive');
    addBuyAnimals('auxilary', 1);
  });
  $('#craft-btn').off('click').on('click', function(){
    craftItems();
  });
  $('#cheat-button').off('click').on('click', function(){
    money = 0;
    firstPlay = true;
    invAnimals = [];
    invSeeds = [];
    invItems = [];
    experience.xp = 3990;
    experience.level = 14;
    experience.update();
    // adding initial animals
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      var animal = new Animal(GLOBAL_ANIMALS[i].name);
      addToInv(GLOBAL_ANIMALS[i].type, animal);
    }
    // adding initial itemsInv
    for(i = 0; i < GLOBAL_ITEMS.length; i++){
      var j = randomNumber(1, 5);
      for(var k = 0; k < 500; k++){
        var item = new Item(GLOBAL_ITEMS[i]);
        addToInv('item', item);
      }
    }
    // adding the default locked animals
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      var name = GLOBAL_ANIMALS[i].name;
      if(name == 'cow' || name == 'chicken' || name == 'sheep'
        || name == 'corn' || name == 'wheat' || name == 'oats'){
        GLOBAL_ANIMALS[i].locked = false;
      } else {
        GLOBAL_ANIMALS[i].locked = true;
      }
    }
    // resetting the rooms
    for(var i = 0; i < rooms.length; i++){
      rooms[i].removeRoom();
    }
    rooms = [];
    // adding initial rooms
    var header = new Room(1, 'header');
    var floor1 = new Room(2, 'pasture');
    var floor2 = new Room(3, 'field');
    var floor3 = new Room(4, 'buy');
    addRoom(header);
    addRoom(floor1);
    addRoom(floor2);
    addRoom(floor3);
    addClicks();
  });
  $('#pause-button').off('click').on('click', function(){
    if(pause){
      $('#pause-button').css('background-image', 'url("img/menu/pausebutton.png")');
      pause = false;
      removeClicks();
      addClicks();
    } else {
      $('#pause-button').css('background-image', 'url("img/menu/playbutton.png")');
      pause = true;
      $('#cheat-button').off('click');
    }
  });
  $('#item-dex').off('click').on('click', function(){
    toggleFooter('hide');
    footerShown = false;
    roomClicked(false, '#dexmenu');
    loadDex('item');
  });
  $('#animal-dex').off('click').on('click', function(){
    toggleFooter('hide');
    footerShown = false;
    roomClicked(false, '#dexmenu');
    loadDex('animal');
  });
  $('#tutorial-button').off('click').on('click', function(){
    roomClicked(false, '#tutorialmenu');
    tutTabClicked('rooms');
  });
  $('#tut-close').off('click').on('click', function(){
    $(document).trigger('click');
  });
  $('#tut-rooms').off('click').on('click', function(){
    tutTabClicked('rooms');
  });
  $('#tut-animals').off('click').on('click', function(){
    tutTabClicked('animals');
  });
  $('#tut-items').off('click').on('click', function(){
    tutTabClicked('items');
  });
  $('#tut-footer').off('click').on('click', function(){
    tutTabClicked('footer');
  });
  $('#tut-prev').off('click').on('click', function(){
    tutSwitchPage(-1);
  });
  $('#tut-next').off('click').on('click', function(){
    tutSwitchPage(1);
  });
}

// removes clicks from main game when entering a menu
function removeClicks(popup){
  $('#buy-button').off('click');
  $('#craft-button').off('click');
  for(var i = 0; i < rooms.length; i++){
    $('#' + rooms[i].id).off('click');
  }
  $('#pause-button').off('click');
  $('#cheat-button').off('click');
  $('#save-button').off('click');
  $('#item-dex').off('click');
  $('#animal-dex').off('click');
  $('#tutorial-button').off('click');
  $('#footer-toggle').off('click');
}

function randomNumber(low, high){
   return Math.floor((Math.random() * (high - low)) + low);
}

function getRandomRoomCoord(){
  var low = (screenWidth - roomWidth) / 2 + 10;
  var high = roomWidth - ((screenWidth - roomWidth) / 2) - 10;
  var x = randomNumber(low, high);
  return x;
}

function toggleFooter(action){
  if(action == 'hide'){
    $('#footer-toggle').css({
      'bottom': '0',
      'background-image': 'url("img/menu/toggleup.png")'
    });
    $('#save-button').off('click');
    $('#cheat-button').off('click');
    $('#pause-button').off('click');
    $('#item-dex').off('click');
    $('#animal-dex').off('click');
    $('#tutorial-button').off('click');
    $('#footer').addClass('hidden');
    $('#footer').css('z-index', '0');
  } else if(action == 'show'){
    $('#footer-toggle').css({
      'bottom': roomHeight,
      'background-image': 'url("img/menu/toggledown.png")'
    });
    $('#footer').removeClass('hidden');
    $('#footer').css('z-index','2');
    addClicks();
  }
}

function loadDex(dex){
  $('.dex-row').remove();
  $('#dexmenu').append('<div id="dex-row-head" class="dex-row"></div>');
  if(dex == 'item'){
    $('#dex-title-text').html('Items');
    var locked = 0;
    var unlocked = 0;
    for(var i = 0; i < GLOBAL_ITEMS.length; i++){
      $('#dexmenu').append('<div id="dex-row-' + GLOBAL_ITEMS[i] + '" class="dex-row">' +
                           '<span class="dex-image"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                           + formatText(GLOBAL_ITEMS[i]) +
                           '<span id="dex-num-' + GLOBAL_ITEMS[i] + '" class="dex-row-num">5</span></div>');
      var inInv = false;
      var invNum = 0;
      for(var j = 0; j < invItems.length; j++){
        if(invItems[j].name == GLOBAL_ITEMS[i]){
          inInv = true;
          invNum = invItems[j].num
        }
      }
      if(!inInv){
        locked++;
        $('#dex-row-' + GLOBAL_ITEMS[i]).css('background-image', 'none');
        $('#dex-num-' + GLOBAL_ITEMS[i]).html('');
      } else {
        unlocked++;
        $('#dex-num-' + GLOBAL_ITEMS[i]).html(invNum);
        $('#dex-row-' + GLOBAL_ITEMS[i]).children('.dex-image').css('background-image',
             'url("img/inv/items/' + GLOBAL_ITEMS[i] + '.png")');
      }
    }
    $('#dex-row-head').html(unlocked + ' / ' + (locked + unlocked) + ' collected');
  } else if (dex == 'animal'){
    $('#dex-title-text').html('Animals');
    var locked = 0;
    var unlocked = 0;
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      $('#dexmenu').append('<div id="dex-row-' + GLOBAL_ANIMALS[i].name + '" class="dex-row">' +
                           '<span class="dex-image"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                           + formatText(GLOBAL_ANIMALS[i].name) +
                           '<span id="dex-num-' + GLOBAL_ANIMALS[i].name + '" class="dex-row-num">5</span></div>');
       var inInv = false;
       var invNum = 0;
       for(var j = 0; j < invAnimals.length; j++){
         if(invAnimals[j].type == GLOBAL_ANIMALS[i].name){
           inInv = true;
           invNum = invAnimals[j].num;
         }
       }
       for(var j = 0; j < invSeeds.length; j++){
         if(invSeeds[j].type == GLOBAL_ANIMALS[i].name){
           inInv = true;
           invNum = invSeeds[j].num;
         }
       }
       if(!inInv){
         locked++;
         $('#dex-row-' + GLOBAL_ANIMALS[i].name).css('background-image', 'none');
         $('#dex-num-' + GLOBAL_ANIMALS[i].name).html('');
       } else {
         unlocked++;
         $('#dex-num-' + GLOBAL_ANIMALS[i].name).html(invNum);
         if(GLOBAL_ANIMALS[i].type == 'animal'){
           $('#dex-row-' + GLOBAL_ANIMALS[i].name).children('.dex-image').css('background-image',
                'url("img/inv/animals/' + GLOBAL_ANIMALS[i].name + '.png")');
         } else  if(GLOBAL_ANIMALS[i].type == 'plant'){
           $('#dex-row-' + GLOBAL_ANIMALS[i].name).children('.dex-image').css('background-image',
               'url("img/inv/items/' + GLOBAL_ANIMALS[i].seed + '.png")');
         }
       }
    }
    $('#dex-row-head').html(unlocked + ' / ' + (locked + unlocked) + ' collected');
  }
  var child = document.getElementById('dexmenu');
  child.style.paddingRight = child.offsetWidth - child.clientWidth + "px";
}

// room object
function Room(z, type){
  // room properties
  this.type = type;
  this.z = z;
  this.color = '';
  // coordinate/sizing values
  this.x = 0;
  this.y = 0;
  this.width = roomWidth;
  this.height = roomHeight;
  // time values
  this.lastCollected = Date.now();
  this.time = 0;
  this.wait = GLOBAL_WAIT_TIMES[this.z];
  // other values
  this.price = GLOBAL_ROOM_PRICES[this.z];
  this.id = 'room' + this.z;
  this.animals = {
    'slot1': 'none',
    'slot2': 'none',
    'slot3': 'none',
  };
  // room initialization
  if(this.type == 'buy'){
    $('#content').append('<div id="' + this.id +
      '" width="' + this.width + '" height="' + this.height +
       '" z="' + this.z + '"><h3 id="buyroom-text">$' + this.price + '</h3></div>');
  } else {
    $('#content').append('<div id="' + this.id +
      '" width="' + this.width + '" height="' + this.height +
       '" z="' + this.z + '"></div>');
  }
  // room methods
  this.collect = false;
  this.update = function(){
    if(this.type == 'pasture' || this.type == 'field'){
      this.time = Date.now() - this.lastCollected;
      this.time = this.time * speed;
      this.timeLeft = this.wait - this.time;
      this.hoursLeft = Math.floor(this.timeLeft / hours);
      this.minutesLeft = Math.floor((this.timeLeft - (this.hoursLeft * hours)) / minutes);
      this.secondsLeft = Math.floor((this.timeLeft - ((this.minutesLeft * minutes) + (this.hoursLeft * hours))) / seconds);
      if(this.timeLeft <= 0){
         this.timeLeft = 0;
         this.hoursLeft = 0;
         this.minutesLeft = 0;
         this.secondsLeft = 0;
      }
      // calculating wait times
      if(activeRoom.z == this.z){
        if(this.secondsLeft < 10) this.secondsLeft = '0' + this.secondsLeft;
        if(this.secondsLeft == 0) this.secondsLeft = '00';
        if(this.minutesLeft < 10) this.minutesLeft = '0' + this.minutesLeft;
        if(this.minutesLeft == 0) this.minutesLeft = '00';
        if((this.getAnimal(1).aux != true && this.getAnimal(1) != 'none' && this.getAnimal(1) != undefined) ||
            (this.getAnimal(2).aux != true && this.getAnimal(2) != 'none' && this.getAnimal(2) != undefined) ||
             (this.getAnimal(3).aux != true && this.getAnimal(3) != 'none' && this.getAnimal(3) != undefined)){
          if(this.timeLeft > 0 && this.collect){
            this.collect = false;
            $('#room-collect').removeClass('rcollect-active');
            $('#room-collect').addClass('rcollect-disabled');
            $('#room-collect').off('click');
          } else if(this.timeLeft == 0 && !this.collect) {
            this.collect = true;
            var ref = this;
            $('#room-collect').removeClass('rcollect-disabled');
            $('#room-collect').addClass('rcollect-active');
            $('#room-collect').on('click', function(){
              ref.addDrops();
              ref.calculateWait();
            });
          }
          $('#room-title').html('<h2>' + formatText(this.type)
              + ' - ' + this.hoursLeft + ':' + this.minutesLeft + ':' + this.secondsLeft + '</h2>');
        } else {
          $('#room-title').html('<h2>' + formatText(this.type) + '</h2>');
        }
      }
    }
    for(var i = 1; i < 4; i++){
      if(this.animals['slot' + i] != 'none'){
        this.animals['slot' + i].update(this, i);
      }
    }
  }
  this.render = function(){
    $('#' + this.id).css({
      'position': 'static',
      'width': this.width,
      'height': this.height,
      'margin-left': 'auto',
      'margin-right': 'auto',
      'background-image': 'url("img/rooms/' + this.type + 'room.png")',
      'background-size': '100% 100%',
      'image-rendering': 'pixelated',
      'top': screenHeight - (this.y * this.z),
      'left': this.x
    });
    for(var i = 1; i < 4; i++){
      if(this.animals['slot' + i] != 'none'){
        this.animals['slot' + i].render();
      }
    }
  }
  this.addClicks = function(){
    $('#' + this.id).click(function(){
      roomClicked(this);
    });
  }
  this.addAnimal = function(animal, slot){
    this.animals['slot' + slot] = new Animal(animal.type);
    this.animals['slot' + slot].lastCollected = Date.now();
    // adding animal x, y, width, and height for rendering
    if(animal.species == 'animal'){
      // width and height are 3/4 the height of a room
      this.animals['slot' + slot].adjustPositioning(getRandomRoomCoord(),
                roomHeight / 25, roomHeight * 0.75, roomHeight * 0.75, this.z);
    } else if(animal.species == 'plant'){
      // x = 1/3 of room width + offset where room starts - half of the crops width
      var x1 = (screenWidth - roomWidth) / 2 + (roomWidth / 5 - (roomHeight * 0.75 / 2));
      var x2 = (screenWidth - roomWidth) / 2 + ((roomWidth / 5 * 2) - (roomHeight * 0.75 / 2));
      var x3 = (screenWidth - roomWidth) / 2 + ((roomWidth / 5 * 3) - (roomHeight * 0.75 / 2));
      var x4 = (screenWidth - roomWidth) / 2 + ((roomWidth / 5 * 4) - (roomHeight * 0.75 / 2));
      this.animals['slot' + slot].adjustPositioning([x1, x2, x3, x4],
                roomHeight / 20, roomHeight * 0.75, roomHeight * 0.75, this.z);
    }
    this.calculateWait();
  }
  this.getAnimal = function(slot){
    return this.animals['slot' + slot];
  }
  this.removeAnimal = function(slot){
    this.animals['slot' + slot].removeFromRoom();
    this.animals['slot' + slot] = 'none';
    this.calculateWait();
  }
  this.removeRoom = function(){
    $('#' + this.id).remove();
  }
  this.calculateWait = function(){
    this.lastCollected = Date.now();
    this.wait = GLOBAL_WAIT_TIMES[this.z];
    //console.log('room wait: ' + (this.wait / 1000) + 's / ' + (this.wait / 60000) + 'm');
    var anims = 0;
    var multipliers = [];
    for(var i = 1; i < 4; i++){
      var anim = this.getAnimal(i);
      if(anim != 'none'){
        // auxilary multiplier not working
        // if  auxilary in the second spot, the time is greater than if its in the third
        if(anim.aux){
          //console.log('auxilary animal: adding multiplier of ' + anim.multiplier);
          //console.log('after multiplier: ' + (this.wait / 1000) + 's / ' + (this.wait / 60000) + 'm');
          multipliers.push(anim.multiplier);
        } else {
          this.wait += anim.wait;
          anims++;
          //console.log('adding animal wait of ' + (anim.wait / 1000) + 's / ' + (anim.wait / 60000) + 'm');
          //console.log('wait after adding animal: ' + (this.wait / 1000) + 's / ' + (this.wait / 60000) + 'm');
        }
      }
    }

    for(var i = 0; i < multipliers.length; i++){
      this.wait = this.wait * multipliers[i];
    }
    if(anims == 2){
      this.wait = this.wait * 0.9;
      //console.log('adding a 0.9 multiplier');
      //console.log('wait after final multiplier: ' + (this.wait / 1000) + 's / ' + (this.wait / 60000) + 'm');
    }else if(anims == 3){
      this.wait = this.wait * 0.75;
      //console.log('adding a 0.75 multiplier');
      //console.log('wait after final multiplier: ' + (this.wait / 1000) + 's / ' + (this.wait / 60000) + 'm');
    }
  }
  this.addDrops = function(){
    var mult = 1;
    var fan = this.getAnimal(1).type;
    var san = this.getAnimal(2).type;
    var tan = this.getAnimal(3).type;
    if((fan == san && fan != 'none' && fan != undefined) ||
        (fan == tan && fan != 'none' && fan != undefined) ||
          (san == tan && san != 'none' && san != undefined)){
      mult = 2;
    }
    if((fan == san && san == tan) && fan != 'none'){
      mult = 4;
    }
    var collectObj = [];
    var collectText = '';
    for(var i = 1; i < 4; i++){
      var type = this.getAnimal(i).type;
      for(var j = 0; j < GLOBAL_ANIMALS.length; j++){
        if(GLOBAL_ANIMALS[j].name == type && GLOBAL_ANIMALS[j].produce != undefined){
          for(var k = 0; k < GLOBAL_ANIMALS[j].produce.length; k++){
            var numSpoils = 0;
            for(var l = 0; l < mult; l++){
              var aYield = randomNumber(GLOBAL_ANIMALS[j].minYield, GLOBAL_ANIMALS[j].maxYield + 1);
              for(var m = 0; m < aYield; m++){
                  numSpoils++;
                  addToInv('item', new Item(GLOBAL_ANIMALS[j].produce[k]));
              }
            }
            var alreadyAdded = false;
            for(var l = 0; l < collectObj.length; l++){
              if(collectObj[l].name == GLOBAL_ANIMALS[j].produce[k]){
                  collectObj[l].num += numSpoils;
                  alreadyAdded = true;
              }
            }
            if(!alreadyAdded){
              collectObj.push({'name': GLOBAL_ANIMALS[j].produce[k], 'num': numSpoils});
            }
          }
        }
      }
    }
    for(var i = 0; i < collectObj.length; i++){
      collectText += collectObj[i].num + ' ' + collectObj[i].name + ' ';
    }
    // plant stuff
    if(this.type == 'field'){
      for(var i = 1; i < 4; i++){
        if(this.getAnimal(i) != 'none' && this.getAnimal(i) != undefined){
            var seedsReturned = randomNumber(0, 3);
            for(var j = 0; j < seedsReturned; j++){
              addToInv('plant', new Animal(this.getAnimal(i).type));
            }
            collectText += seedsReturned + ' seeds ';
            this.removeAnimal(i);
        }
      }
      // displaying popup
      displayInvAnimals(true);
    }
    // xp stuff
    var xp = 0;
    for(var i = 1; i < 3; i++){
      var a = this.getAnimal(i);
      if(a != 'none' && a != undefined){
        xp += a.xp;
      }
    }
    experience.increaseXp(xp);
    var popup = new Popup('spoils', collectText, false, function(){}, function(){
      roomClicked(activeRoom);
    });
  }
}

// function gets a random behaviour and time for an animal
var BEHAVIOURS = ['walk', 'stand'];
function getBehaviour(){
  var behaviour = {};
  var chance = randomNumber(0, 101);
  if(chance >= 20){
    behaviour.name = BEHAVIOURS[0];
  } else {
    behaviour.name = BEHAVIOURS[1];
  }
  behaviour.time = randomNumber(10 * seconds, 20 * seconds);
  behaviour.start = Date.now();
  var r = randomNumber(1, 3);
  if(r == 1){
    behaviour.dir = 'left';
  } else {
    behaviour.dir = 'right';
  }
  return behaviour;
}

function Animal(type){
  // animal properties
  this.type = type;
  this.updated = 0;
  this.price = 0;
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.el = '';
  this.behaviour = getBehaviour();
  this.time = Date.now();
  this.lastCollect = Date.now();
  // properties for controlling movement
  this.dir = 'right';
  this.gaindex = 0;
  // getting properties from global animal variables
  for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
    if(this.type == GLOBAL_ANIMALS[i].name){
      this.gaindex = i;
      this.wait = GLOBAL_ANIMALS[i].wait;
      this.species = GLOBAL_ANIMALS[i].type;
      this.price = GLOBAL_ANIMALS[i].price;
      this.aux = GLOBAL_ANIMALS[i].aux;
      this.multiplier = GLOBAL_ANIMALS[i].multiplier;
      this.seed = GLOBAL_ANIMALS[i].seed;
      this.xp = GLOBAL_ANIMALS[i].xp;
    }
  }
  // animal functions
  var progress = 0;
  this.update = function(room, spot){
    this.time = Date.now();
    if(this.species == 'animal'){
      // behaviour stuff
      if(this.time - this.behaviour.start > this.behaviour.time){
        this.behaviour = getBehaviour();
        this.changeDirections(this.behaviour.dir);
      }
      // movement
      this.updated += 1;
      if(this.updated % 2 == 0){
        // movement
        if(this.behaviour.name == 'walk'){
          if(this.dir == 'left'){
            this.x -= 1;
          } else {
            this.x += 1;
          }
          if(this.x <= (screenWidth - roomWidth) / 2 + 10) this.changeDirections();
          if(this.x >= (screenWidth - roomWidth) / 2 + (roomWidth - this.width) - 10) this.changeDirections();
          this.el.css('left', this.x);
        } else if(this.behaviour.name == 'stand'){
        }
      }
    } else if(this.species == 'plant'){
      // harvest times
      if(room.time >= this.wait){
        progress = 0;
        // this.dropSpoils(room, spot);
      }else if(room.time >= this.wait * 0.8 && progress < 4){
        progress++;
        for(var i = 0; i < this.el.length; i++){
            this.el[i].css('background-image', 'url("img/crops/' + this.type + '5.png")');
        }
      }else if(room.time >= this.wait * 0.6 && progress < 3){
        progress++;
        for(var i = 0; i < this.el.length; i++){
            this.el[i].css('background-image', 'url("img/crops/' + this.type + '4.png")');
        }
      }else if(room.time >= this.wait * 0.4 && progress < 2){
        for(var i = 0; i < this.el.length; i++){
            this.el[i].css('background-image', 'url("img/crops/' + this.type + '3.png")');
        }
        progress++;
      }else if(room.time >= this.wait * 0.2 && progress < 1){
        for(var i = 0; i < this.el.length; i++){
            this.el[i].css('background-image', 'url("img/crops/' + this.type + '2.png")');
        }
        progress++;
      }
    }
  }
  this.render = function(){}
  // for multiple animals stacked in inventory
  this.num = 1;
  this.addAnimal = function(){
    this.num += 1;
  }
  this.removeAnimal = function(){
    if(this.num > 0){
      this.num -= 1;
    }
    if(this.num == 0){
      removeFromInv(this.species, this.type);
    }
  }
  this.adjustPositioning = function(x, y, width, height, z){
    this.x = x;
    this.y = y  + (roomHeight * (z - 1));
    this.width = width;
    this.height = height;
    this.el = $('<div></div>');
    if(this.species == 'animal'){
      var imgURL = 'img/inv/animals/' + this.type + '.gif';
      this.el.css({
          'position': 'absolute',
          'top': this.y,
          'left': this.x,
          'width': this.width,
          'height': this.height,
          'display': 'inline-block',
          'background-image': 'url("' + imgURL + '")',
          'background-size': '100%',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          'image-rendering': 'pixelated'
      });
      var direction = randomNumber(1, 3);
      if(direction == 1){
        this.changeDirections('left');
      } else {
        this.changeDirections('right');
      }
      $('#room' + z).append(this.el);
    } else {
      var imgURL = 'img/crops/' + this.type + '1.png';
      this.el = [$('<div></div>'), $('<div></div>'), $('<div></div>'), $('<div></div>')];
      for(var i = 0; i < x.length; i++){
        this.el[i].css({
            'position': 'fixed',
            'top': this.y,
            'left': this.x[i],
            'width': this.width,
            'height': this.height,
            'display': 'inline-block',
            'background-image': 'url("' + imgURL + '")',
            'background-size': '100%',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'image-rendering': 'pixelated'
        });
        $('#room' + z).append(this.el[i]);
      }
    }
  }
  this.removeFromRoom = function(){
    if(this.species == 'animal'){
        this.el.remove();
    } else {
        for(var i = 0; i < this.el.length; i++){
          this.el[i].remove();
        }
    }
  }
  this.changeDirections = function(direction){
    if(direction == undefined){
      if(this.dir == 'left'){
        this.dir = 'right';
      } else {
        this.dir = 'left';
      }
    } else {
      this.dir = direction;
    }
    if(this.dir == 'left'){
      this.el.css({
        '-webkit-transform': 'scaleX(-1)',
        '-moz-transform': 'scaleX(-1)',
        '-ms-transform': 'scaleX(-1)',
        '-o-transform': 'scaleX(-1)',
        'transform': 'scaleX(-1)'
      });
    } else {
      this.el.css({
        '-webkit-transform': 'scaleX(1)',
        '-moz-transform': 'scaleX(1)',
        '-ms-transform': 'scaleX(1)',
        '-o-transform': 'scaleX(1)',
        'transform': 'scaleX(1)'
      });
    }
  }
  this.dropSpoils = function(room, i){
    this.lastCollected = Date.now();
    var spoils = [];
    if(this.species == 'animal'){
      var min = GLOBAL_ANIMALS[this.gaindex].timeMin;
      var max = GLOBAL_ANIMALS[this.gaindex].timeMax;
      this.harvest = randomNumber(min, max);
      var drops = GLOBAL_ANIMALS[this.gaindex].produce;
      var r = randomNumber(0, drops.length);
      var drop = drops[r];
      var spoil = new Drop(drop);
      spoils.push(spoil);
    } else {
      room.removeAnimal(i);
      var drop = GLOBAL_ANIMALS[this.gaindex].produce[0];
      for(var i = 0; i < 10; i++){
        var spoil = new Drop(drop);
        spoils.push(spoil);
      }
    }
    var dropAdded = false;
    for(var i = 0; i < spoils.length; i++){
      for(var j = 0; j < floorDrops.length; j++){
        if(floorDrops[j].item.name == spoils[i].item.name){
          var floorx = floorDrops[j].x;
          var floorwidth = floorDrops[j].width;
          var spoilx = spoils[i].x;
          if(spoilx >= floorx - floorwidth && spoilx <= floorx + floorwidth){
            floorDrops[j].addItem();
            spoils[i].deleteItem();
            dropAdded = true;
            break;
          }
        }
      }
      if(!dropAdded){
          floorDrops.push(spoils[i]);
      }
    }
    /**console.log('');
    for(var i = 0; i < floorDrops.length; i++){
      console.log('floor drops ' + i + ': ' + floorDrops[i].item.name + ', ' + floorDrops[i].num);
    }
    console.log('');**/
  }
}

function Drop(item, x, on){
  this.item = new Item(item);
  this.on = on;
  this.num = 1;
  if(x){
    this.x = x;
  } else {
    this.x = getRandomRoomCoord();
  }
  this.y = screenHeight - roomHeight - 5;
  this.width = roomHeight * 0.75;
  this.height = roomHeight * 0.75;
  var ref = this;
  this.spoilHTML = $('<div><div>').css({
    'position': 'fixed',
    'width': this.width,
    'height': this.height,
    'top': this.y,
    'left': this.x,
    'background-image': 'url("img/inv/items/' + this.item.name + '.png")',
    'background-size': '100% 100%',
    'image-rendering': 'pixelated'
  }).click(function(){
    if(ref.on != undefined){
      ref.on.spoilHTML.trigger('click');
      this.remove();
    } else {
      for(var i = 0; i < ref.num; i++){
          addToInv('item', ref.item);
      }
      $(this).remove();
      for(var i = 0; i < floorDrops.length; i++){
        if(floorDrops[i] == ref){
          floorDrops.splice(i, 1);
          return;
        }
      }
    }
  });
  $('#content').append(this.spoilHTML);
  this.addItem = function(){
    this.num += 1;
    // if stacking items display items in a stack
    if(this.num == 2 || this.num == 3){
      var stackx = (this.width / 16) * (this.num - 1) + this.x;
      var stackSpoil = new Drop(this.item.name, stackx, this);
    }
  }
  this.removeItem = function(){
    this.num -= 1;
  }
  this.deleteItem = function(){
    this.spoilHTML.remove();
  }
}

function Item(name){
  this.name = name;
  this.num = 1;
  this.addItem = function(){
    this.num += 1;
  }
  this.removeItem = function(){
    this.num -= 1;
  }
}

function CraftingTable(){
  this.items = {
    'slot1': 'none',
    'slot2': 'none',
    'slot3': 'none'
  }
  this.addItem = function(item, slot){
    this.items['slot' + slot] = item;
  }
  this.getItem = function(slot){
    return this.items['slot' + slot];
  }
  this.removeItem = function(slot){
    this.items['slot' + slot] = 'none';
  }
  this.getAll = function(){
    var all = [];
    if(this.items['slot1'] != 'none') all.push(this.items['slot1'].name);
    if(this.items['slot2'] != 'none') all.push(this.items['slot2'].name);
    if(this.items['slot3'] != 'none') all.push(this.items['slot3'].name);
    return all;
  }
}

function Popup(type, text, cancel, onPopup, onOk, onCancel){
  // popup properties
  this.type = type;
  this.class = type + '-popup';
  this.width = 200;
  this.height = btnHeight * 3;
  this.text = text;
  this.cancel = cancel;
  // function to happen when ok button is pressed
  this.onPopup = onPopup;
  this.onOk = onOk;
  this.onCancel = onCancel;
  // adding to screen
  if(!this.cancel){
    $('body').append('<div class="popup ' + this.class + '"><div id="popup-top-half"><div id="popup-text">' +
      this.text + '</div></div><div id="popup-bottom-half"><div class="popup-btn"><div id="popup-btn-inner">' +
      '<div id="popup-btn-text">OK</div></div></div></div></div>');
  } else {
    $('body').append('<div class="popup ' + this.class + '"><div id="popup-top-half"><div id="popup-text">' +
      this.text + '</div></div><div id="popup-bottom-half"><div class="popup-btn"><div id="popup-btn-inner">' +
      '<div id="popup-btn-text">Ok</div></div></div>' +
      '<div class="popup-cancel"><div id="popup-btn-inner">' +
      '<div id="popup-btn-text">Cancel</div></div></div>' +
      '</div></div>');
  }
  if(type == 'sell' || type == 'buyroom' || type == 'objective'){
    $('.popup img').attr('height', btnHeight);
    $('.popup img').attr('width', btnHeight);
    this.height = btnHeight * 5;
  }
  // hiding menus
  $('#craftmenu').hide();
  $('#buymenu').hide();
  $('#floormenu').hide();
  $('#dexmenu').hide();
  $('#tutorialmenu').hide();
  removeClicks();
  $(document).off('click');
  // adding clicks and sizing to the popup
  var ref = this;
  $('.popup-btn').click(function(){
    ref.remove();
  });
  $('.' + this.class).css({
    'width': ref.width,
    'height': ref.height,
    'top': (screenHeight - ref.height) / 2,
    'left': (screenWidth - ref.width) / 2
  });
  if(this.height > btnHeight * 4){
    $('.' + this.class).css({
      'background-image': 'url("img/menu/popuplarge.png")'
    });
  }
  $('.popup-btn').css({
    'width': btnWidth,
    'height': btnHeight
  });
  $('.popup-cancel').css({
    'width': btnWidth,
    'height': btnHeight
  });
  if(this.cancel){
    $('.popup-btn').css({
      'left': '65%',
      'transform': 'translateX(-35%)'
    });
    var ref = this;
    $('.popup-cancel').off('click').on('click', function(){
      if(ref.onCancel != undefined){
        addClicks();
        toggleFooter('hide');
        ref.onCancel();
      } else {
        addClicks();
        toggleFooter('hide');
      }
      $('.' + ref.class).remove();
    });
  }
  if(this.onPopup != undefined){
    this.onPopup();
  }
  this.remove = function(){
    if(this.onOk != undefined){
      addClicks();
      toggleFooter('hide');
      this.onOk();
    } else {
      addClicks();
      toggleFooter('hide');
    }
    $('.' + this.class).remove();
  }
}

// Experience bar object
function xpBar(){
  this.x = 0;
  this.y = roomHeight - 5;
  this.height = 5;
  this.xp = 0;
  this.level = 1;
  this.nextLvl = GLOBAL_XP[this.level];
  this.barHTML = $('<div id="xp-bar"></div>');
  this.xpHTML = $('<div id="xp-bar"></div>');
  $('#content').append(this.barHTML);
  $('#content').append(this.xpHTML);
  // xp bar methods
  this.increaseXp = function(xp){
    if(this.level < 30){
      this.xp += xp;
      if(this.xp >= this.nextLvl){
        this.levelUp();
      }
      this.update();
    }
  }
  this.levelUp = function(){
    this.xp = this.xp - this.nextLvl;
    this.level += 1;
    this.nextLvl = GLOBAL_XP[this.level];
    this.unlockPlants();
  }
  this.update = function(){
    this.nextLvl = GLOBAL_XP[this.level];
    this.barHTML.css({
      'position': 'fixed',
      'top': this.y,
      'left': this.x,
      'width': '100%',
      'height': this.height,
      'background-color': 'black',
      'z-index': '3'
    });
    var percent;
    if(this.xp == 0){
      percent = 0;
    } else {
      percent = Math.floor(this.xp / this.nextLvl * 100);
    }
    this.xpHTML.css({
      'position': 'fixed',
      'top': this.y,
      'left': this.x,
      'width': percent + '%',
      'height': this.height,
      'background-color': '#0066ff',
      'z-index': '3'
    });
  }
  this.unlockPlants = function(){
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      if(GLOBAL_ANIMALS[i].type == 'plant' || GLOBAL_ANIMALS[i].aux){
        if(GLOBAL_ANIMALS[i].lvl <= this.level){
          GLOBAL_ANIMALS[i].locked = false;
        }
      }
    }
  }
  this.update();
}

/** floor menu functions **/
// function adds the players inventory animals to the bottom 4 slots of the room menu
function displayInvAnimals(seed){
  for(var i = 0; i < 4; i++){
    if(seed){
      var animal = invSeeds[i];
    } else {
      var animal = invAnimals[i];
    }
    $('#ritems' + (i + 1)).empty();
    if(animal != undefined){
      var itemText = '';
      if(animal.num > 1){
        itemText = animal.num;
      }
      var path = 'animals/' + animal.type;
      if(seed){
        path = 'items/' + animal.seed;
      }
      $('#ritems' + (i + 1)).append('<span class="inner-slot"><div class="inv-count">' + itemText + '</span>');
      $('#ritems' + (i + 1)).css({
        'background-image': 'url("img/menu/slot.png")',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'image-rendering': 'pixelated'
      });
      $('#ritems' + (i + 1)).children('.inner-slot').css({
        'background-image': 'url("img/inv/' + path + '.png")',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'image-rendering': 'pixelated'
      });
    } else {
      $('#ritems' + (i + 1)).append('<span class="inner-slot hidden"></span>');
      $('#ritems' + (i + 1)).css({
        'background-image': 'url("img/menu/slot.png")',
        'background-size': '100% 100%',
        'image-rendering': 'pixelated'
      });
    }
  }
  for(var i = 0; i < 3; i++){
    var animal = activeRoom.getAnimal(i + 1);
    var path = 'animals/' + animal.type;
    if(seed){
      path = 'items/' + animal.seed;
    }
    $('#ranimals' + (i + 1)).empty();
    if(animal != 'none'){
      $('#ranimals' + (i + 1)).append('<span class="inner-slot" index="' + i + '"></span>');
      $('#ranimals' + (i + 1)).css({
        'background-image': 'url("img/menu/slot.png")',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'image-rendering': 'pixelated'
      });
      $('#ranimals' + (i + 1)).children('.inner-slot').css({
        'background-image': 'url("img/inv/' + path + '.png")',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'image-rendering': 'pixelated'
      });
    } else {
      $('#ranimals' + (i + 1)).append('<span class="inner-slot hidden" index="' + i + '"></span>');
      $('#ranimals' + (i + 1)).css({
        'background-image': 'url("img/menu/slot.png")',
        'background-size': '100% 100%',
        'image-rendering': 'pixelated'
      });
    }
  }
}

// moves an animal from inventory into room slots
function transferAnimal(animal, slot, from){
  if((activeRoom.type == 'pasture' && animal.species == 'animal')
      || (activeRoom.type == 'field' && animal.species == 'plant')){
    if(activeRoom.getAnimal(slot) != 'none'){
      if(activeRoom.type == 'pasture'){
        addToInv('animal', activeRoom.getAnimal(slot));
      } else if(activeRoom.type == 'field'){
        addToInv('plant', activeRoom.getAnimal(slot));
      }
      activeRoom.removeAnimal(slot);
    }
    if(activeRoom.type == 'pasture'){
      activeRoom.addAnimal(animal, slot);
      removeFromInv('animal', (from - 1));
      displayInvAnimals(false);
    } else if(activeRoom.type == 'field'){
      activeRoom.addAnimal(animal, slot);
      removeFromInv('plant', (from - 1));
      displayInvAnimals(true);
    }
  }
}

// popsup the sell menu to sell an animal
function sellAnimal(type, animal) {
    var count = countInInv(type, animal);
    if(type == 'animal'){
      var imgText = 'animals/' + animal.type;
    }else if(type == 'plant'){
      var imgText = 'items/' + animal.type + 'seed';
    }
  var sellHTML = '<div>Selling ' + imgText +
    '<img align="right" src="img/inv/' + imgText + '.png" style="padding: 10px">' +
    '<br>How many: <input type="number" id="sellnum" value="' + count +
    '" min="1" max="' + count + '" item="' + animal.type + '"></div>';
  var popup = new Popup('sell', sellHTML, true, function(){}, function(){
    var num = parseInt($('#sellnum').val());
    var max = parseInt($('#sellnum').attr('max'));
    var min = parseInt($('#sellnum').attr('min'));
    if(num > max) num = max;
    if(num < min) num = min;
    if(num % 1 != 0) Math.trunc(num);
    if(num == NaN) num = 0;
    // var animal = $('#sellnum').attr('item');
    // add money
    var price = 0;
    var index;
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      if(GLOBAL_ANIMALS[i].name == animal.type){
        price = GLOBAL_ANIMALS[i].price * 0.75;
        index = i;
      }
    }
    price = price * num;
    money += price;
    // remove items
    for(var i = 0; i < num; i++){
      removeFromInv(type, animal.type);
    }
    roomClicked(activeRoom);
  });
}

// function trades two animals in inv for one upgraded animal
function upgradeAnimal(animal){
  if(animal.num >= 2){
    var upgrade = false;
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      if(GLOBAL_ANIMALS[i].name == animal.type){
        upgrade = GLOBAL_ANIMALS[i].upgrade;
      }
    }
    if(upgrade != false){
      for(var i = 0; i < invAnimals.length; i++){
        if(invAnimals[i].type == animal.type){
          invAnimals[i].removeAnimal();
          invAnimals[i].removeAnimal();
        }
      }
      var upgraded = new Animal(upgrade);
      addToInv('animal', upgraded);
      displayInvAnimals(false);
      var popup = new Popup('upgrade', formatText(animal.type) + ' has been upgraded', false, function(){}, function(){
        roomClicked(activeRoom);
      });
    } else {
      var popup = new Popup('upgrade', 'You cannot upgrade this animal', false, function(){}, function(){
        roomClicked(activeRoom);
      });
    }
  } else {
    var popup = new Popup('upgrade', 'You need two of the same animal to upgrade them', false, function(){}, function(){
      roomClicked(activeRoom);
    });
  }
}

// adds click events for all the slots
var currentSlot;
function roomSlotClicks(){
  // room animal slots
  for(var i = 0; i < 3; i++){
    $('#ranimals' + (i + 1)).click(function(){
      if(currentSlot == false || currentSlot == undefined){
        var index = parseInt($(this).attr('index')) + 1;
        var animal = activeRoom.getAnimal(index);
        if(animal != 'none'){
          activeRoom.removeAnimal(index);
          if(animal.species == 'animal'){
            addToInv('animal', animal);
            displayInvAnimals(false);
          } else if(animal.species == 'plant'){
            addToInv('plant', animal);
            displayInvAnimals(true);
          }
        }
      }
    });
  }
  // room inventory slots
  for(var i = 0; i < 4; i++){
    $('#ritems' + (i + 1)).click(function(){
      for(var ii = 0; ii < 4; ii++){
        $('#ritems' + (ii + 1)).removeClass('slot-active');
      }
      currentSlot = $(this);
      $(this).addClass('slot-active');
      $('#floormenu').off('click');
      var lblIndex = currentSlot.attr('index');
      $('#animals-lbl').html(formatText(invAnimals[lblIndex].type));
      setTimeout(function(){
        $('#floormenu').on('click', function(){
          $('#animals-lbl').html('&nbsp;');
          if($(event.target).is($('#ranimals1')) || $(event.target).is($('#ranimals2'))
              || $(event.target).is($('#ranimals3')) || $(event.target).is('#room-animals span')
              || $(event.target).is($('#room-sellslot')) || $(event.target).is($('#upgrade-slot'))){
            var index = currentSlot.attr('index');
            if ($(event.target).is($('#room-sellslot'))) {
                if (activeRoom.type == 'pasture') {
                    sellAnimal('animal', invAnimals[index]);
                } else if (activeRoom.type == 'field') {
                    sellAnimal('plant', invSeeds[index]);
                }
            } else if($(event.target).is($('#upgrade-slot'))){
              if (activeRoom.type == 'pasture') {
                upgradeAnimal(invAnimals[index]);
              }
            } else {
              if(activeRoom.type == 'pasture'){
                if(invAnimals[index] != undefined){
                  transferAnimal(invAnimals[index], parseInt($(event.target).attr('index')) + 1, parseInt(index) + 1);
                }
              } else if(activeRoom.type == 'field'){
                if(!$(event.target).is('#ranimals1 *, #ranimals1') && !$(event.target).is('#ranimals3 *, #ranimals3')){
                  if(invSeeds[index] != undefined){
                    transferAnimal(invSeeds[index], parseInt($(event.target).attr('index')) + 1, parseInt(index) + 1);
                  }
                }
              }
            }
            currentSlot.removeClass('slot-active');
          } else if(!$(event.target).is(currentSlot) && !$(event.target).parents(currentSlot).is(currentSlot)){
            currentSlot.removeClass('slot-active');
          }
          $('#floormenu').off('click');
          currentSlot = false;
        });
      }, 100);
    });
  }
}

/** buy menu functions **/
// lists all the animals you can buy in the buy menu
function addBuyAnimals(type, page){
  var animalsAdded = 0;
  var minAnimal = (page - 1) * 4;
  $('.buy-animal').remove();
  $('.buy-locked').remove();
  $('#buy-title').remove();
  $('<div id="buy-title"><h3>' + formatText(type) + 's</h3></div>').insertBefore('#buy-prev');
  // counts how many of each there is
  var animalsCount = 0;
  var plantsCount = 0;
  var auxCount = 0;
  for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
    var ga = GLOBAL_ANIMALS[i];
    if(ga.aux){
      auxCount++;
    } else if(ga.type == 'plant'){
      plantsCount++;
    } else if(ga.buy){
      animalsCount++;
    }
  }
  // adds plants and animals to menu
  for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
    if(GLOBAL_ANIMALS[i].buy){
      if(animalsAdded >= minAnimal + 4){
        $('#buy-next').off('click').on('click', function(){
          // if statement prevents moving to next page if there is no more animals
          if((minAnimal + 4 < animalsCount && type == 'animal') ||
              (minAnimal + 4 < plantsCount && type == 'plant') ||
                (minAnimal + 4 < auxCount && type == 'auxilary'))
          addBuyAnimals(type, page + 1);
        });
        $('#buy-prev').off('click').on('click', function(){
          // if statement prevents moving to prev page if on first page
          if(page > 1) addBuyAnimals(type, page - 1);
        });
        return;
      } else {
        $('#buy-next').off('click');
      }
      if ((GLOBAL_ANIMALS[i].type == type && GLOBAL_ANIMALS[i].aux == undefined)
            || (type == 'auxilary' && GLOBAL_ANIMALS[i].aux)) {
          var split = 0;
          var itemsText = '<br>';
          for (var property in GLOBAL_ANIMALS[i].cost) {
              if (split % 2 == 0 && split != 0) itemsText += '<br>';
              split++;
              itemsText += GLOBAL_ANIMALS[i].cost[property] +
                  ' <img src="img/inv/items/' + property + '.png" alt="' + property + '">';
          }
        animalsAdded++;
        if(animalsAdded > minAnimal){
            if (GLOBAL_ANIMALS[i].locked == false) {
                var displayName = formatText(GLOBAL_ANIMALS[i].name);
                var path = 'animals/' + GLOBAL_ANIMALS[i].name;
                if (GLOBAL_ANIMALS[i].type == 'plant') {
                    displayName = formatText(GLOBAL_ANIMALS[i].seed);
                    path = 'items/' + GLOBAL_ANIMALS[i].seed;
                }
            $('<div id="buy-' + GLOBAL_ANIMALS[i].name +
              '" class="buy-animal" type="' + GLOBAL_ANIMALS[i].name + '" style="white-space: nowrap"><span' +
              ' id="' + GLOBAL_ANIMALS[i].name + '-buy-img" class="buy-animal-img">' +
                displayName + '</span><span class="buy-animal-text">' +
                '<br>$' + GLOBAL_ANIMALS[i].price +
                // itemsText displays what items you need to "pay" for the animal
                itemsText + '</span></div>').insertBefore('#buy-prev');
            $('#buy-' + GLOBAL_ANIMALS[i].name).off('click').on('click', function(){
              buyAnimal(type, new Animal($(this).attr('type')));
            });
            $('#' + GLOBAL_ANIMALS[i].name + '-buy-img').css({
              'background-image': 'url("img/inv/' + path + '.png")',
              'background-size': '90%',
              'background-repeat': 'no-repeat',
              'background-position': 'center',
              'image-rendering': 'pixelated'
            });
          } else {
            if(GLOBAL_ANIMALS[i].type == 'animal'){
              $('<div class="buy-locked"><span class="buy-locked-img">' +
                '</span><span class="buy-locked-text"><br>Locked</span></div>').insertBefore('#buy-prev');
            } else if(GLOBAL_ANIMALS[i].type == 'plant' || GLOBAL_ANIMALS[i].aux){
              $('<div class="buy-locked"><span class="buy-locked-img">' +
                '</span><span class="buy-locked-text"><br>Level ' + GLOBAL_ANIMALS[i].lvl + '</span></div>').insertBefore('#buy-prev');
            }
          }
        }
      }
    }
  }
}

/** craft menu functions **/
// function takes all the items in the crafting bench and attempt to craft/unlock an animal
function craftItems(){
  // order items and compare to recipes
  var craftItems = craftBench.getAll();
  craftItems = orderItems(craftItems);
  if(craftItems.length < 1) return;
  craftItems = craftItems[0] + ', ' + craftItems[1] + ', ' + craftItems[2];
  var result;
  var recipeType;
  for(var i = 0; i < GLOBAL_RECIPES.length; i++){
    var sorted = orderItems(GLOBAL_RECIPES[i].input);
    var recipe = sorted[0] + ', ' + sorted[1] + ', ' + sorted[2];
    if(craftItems == recipe){
      result = GLOBAL_RECIPES[i].output;
      recipeType = GLOBAL_RECIPES[i].type;
    }
  }
  // unlock animal
  if(result != undefined){
    if(recipeType == 'animal'){
      for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
        if(result == GLOBAL_ANIMALS[i].name){
            GLOBAL_ANIMALS[i].locked = false;
        }
      }
    } else if(recipeType == 'item'){
      addToInv('item', new Item(result));
    }
    var popup = new Popup('craft', 'A ' + result + ' has been crafted', false, function(){}, function(){
      roomClicked(false, '#craftmenu');
    });
  } else {
    var popup = new Popup('craft', 'Crafting failed', false, function(){}, function(){
      roomClicked(false, '#craftmenu');
    });
    addToInv('item', new Item('garbage'));
  }
  // remove items from crafting bench
  for(var i = 1; i < 4; i++){
    craftBench.removeItem(i);
    displayInvItems();
  }
}

// function adds the players inventory items to the bottom 9 slots
function displayInvItems(){
  for(var i = 0; i < 9; i++){
    var item = invItems[i];
    $('#citems' + (i + 1)).empty();
    if(item != undefined){
      var itemText = '';
      if(item.num > 1){
        itemText = item.num;
      }
      $('#citems' + (i + 1)).append('<span class="inner-slot"><div class="inv-count">' + itemText + '</div></span>');
      $('#citems' + (i + 1) + ' span').css({
        'background-image': 'url("img/inv/items/' + item.name + '.png")',
        'background-size': '90% 90%',
        'image-rendering': 'pixelated'
      });
    } else {
      $('#citems' + (i + 1)).append('<span class="inner-slot hidden"></span>');
      $('#citems' + (i + 1) + ' span').css({
        'background-image': 'url("img/menu/blank.png")',
        'background-size': '90% 90%',
        'image-rendering': 'pixelated'
      });
    }
  }
  for(var i = 0; i < 3; i++){
    var item = craftBench.getItem(i + 1);
    $('#craft' + (i + 1)).empty();
    if(item != 'none'){
      $('#craft' + (i + 1)).append('<span class="inner-slot" index="' + i + '"></span>');
      $('#craft' + (i + 1) + ' span').css({
        'background-image': 'url("img/inv/items/' + item.name + '.png")',
        'background-size': '90% 90%',
        'image-rendering': 'pixelated'
      });
    } else {
      $('#craft' + (i + 1)).append('<span class="inner-slot hidden" index="' + i + '"></span>');
      $('#craft' + (i + 1) + ' span').css({
        'background-image': 'url("img/menu/blank.png")',
        'background-size': '90% 90%',
        'image-rendering': 'pixelated'
      });
    }
  }
}

// moves an animal from inventory into room slots
function transferItems(item, slot, from){
  if(craftBench.getItem(slot) != 'none'){
    addToInv('item', craftBench.getItem(slot));
  }
  craftBench.addItem(item, slot);
  removeFromInv('item', (from - 1));
  displayInvItems();
}

// popsup the sell menu to sell an item
function sellItem(item){
  var count = countInInv('item', item);
  var sellHTML = '<div>Selling ' + item.name +
    '<img align="right" src="img/inv/items/' + item.name + '.png" style="padding: 10px">' +
    '<br>How many: <input type="number" id="sellnum" value="' + count +
    '" min="1" max="' + count + '" item="' + item.name + '"></div>';
  var popup = new Popup('sell', sellHTML, true, function(){}, function(){
    var num = parseInt($('#sellnum').val());
    var max = parseInt($('#sellnum').attr('max'));
    var min = parseInt($('#sellnum').attr('min'));
    if(num > max) num = max;
    if(num < min) num = min;
    if(num % 1 != 0) Math.trunc(num);
    if(num == NaN) num = 0;
    var item = $('#sellnum').attr('item');
    // add money
    price = 0;
    var index;
    for(var i = 0; i < GLOBAL_ITEMS.length; i++){
      if(GLOBAL_ITEMS[i] == item){
        index = i;
      }
    }
    price = GLOBAL_ITEM_PRICES[index];
    price = price * num;
    money += price;
    // remove items
    for(var i = 0; i < num; i++){
      removeFromInv('item', item);
    }
    roomClicked(false, '#craftmenu');
  });
}

// adds click events for all crafting slots
var currentCraftSlot;
function craftSlotClicks(){
  // crafting slots
  for(var i = 0; i < 3; i++){
    $('#craft' + (i + 1)).off('click').on('click', function(){
      if(currentCraftSlot == false){
        var index = parseInt($(this).attr('index')) + 1;
        var item = craftBench.getItem(index);
        if(item != 'none'){
          craftBench.removeItem(index);
          addToInv('item', item);
          displayInvItems();
        }
      }
    });
  }
  $('#tap-slot').off('click').on('click', function(){
    addToInv('item', new Item('water'));
    displayInvItems();
  });
  // crafting inventory slots
  for(var i = 0; i < 9; i++){
    $('#citems' + (i + 1)).click(function(){
      for(var ii = 0; ii < 9; ii++){
        $('#citems' + (ii + 1)).removeClass('slot-active');
      }
      currentCraftSlot = $(this);
      $(this).addClass('slot-active');
      $('#craftmenu').off('click');
      // showing the item clicked in the items label
      var lblIndex = currentCraftSlot.attr('index');
      $('#items-lbl').html(formatText(invItems[lblIndex].name));
      setTimeout(function(){
        $('#craftmenu').on('click', function(){
          $('#items-lbl').html('&nbsp;');
          if(($(event.target).is($('#craft1')) || $(event.target).is($('#craft2'))
              || $(event.target).is($('#craft2')) || $(event.target).is('span', '#crafting-inv'))
              && (!$(event.target).is($('#hslot1')) && !$(event.target).is($('#hslot2')))){
            var index = currentCraftSlot.attr('index');
            if(invItems[index] != undefined){
              if($(event.target).is('#sell-slot')){
                  sellItem(invItems[index]);
              } else {
                  transferItems(invItems[index], parseInt($(event.target).attr('index')) + 1, parseInt(index) + 1);
              }
            }
            currentCraftSlot.removeClass('slot-active');
          } else if(!$(event.target).is(currentCraftSlot) && !$(event.target).parents(currentCraftSlot).is(currentCraftSlot)){
            currentCraftSlot.removeClass('slot-active');
          }
          $('#craftmenu').off('click');
          currentCraftSlot = false;
        });
      }, 100);
    });
  }
}

// for inventory to display next page
function invNextPage(inv, pageSize){
  if(pageSize >= inv.length){
    return inv;
  }
  var first = [];
  var second = [];
  for(var i = 0; i < pageSize; i++){
    first.push(inv[i]);
  }
  for(var i = pageSize; i < inv.length; i++){
    second.push(inv[i]);
  }
  inv = second;
  for(var i = 0; i < first.length; i++){
    inv.push(first[i]);
  }
  return inv;
}

// function to add items or animals to players inventory
function addToInv(type, item){
  if(type == 'animal'){
      if(invAnimals.length > 0){
        for(var i = 0; i < invAnimals.length; i++){
          if(invAnimals[i].type == item.type){
            invAnimals[i].addAnimal();
            return;
          }
        }
      }
      invAnimals.push(item);
  } else if(type == 'item'){
    if(invItems.length > 0){
      for(var i = 0; i < invItems.length; i++){
        if(invItems[i].name == item.name){
          invItems[i].addItem();
          return;
        }
      }
    }
    invItems.push(item);
  } else if(type == 'plant'){
    if(invSeeds.length > 0){
      for(var i = 0; i < invSeeds.length; i++){
        if(invSeeds[i].type == item.type){
          invSeeds[i].addAnimal();
          return;
        }
      }
    }
    invSeeds.push(item);
  }
}

// function to remove items or animals from players inventory
function removeFromInv(type, index){
  if(type == 'animal'){
    if(isNaN(index)){
      for(var i = 0; i < invAnimals.length; i++){
        if(index == invAnimals[i].type){
          index = i;
        }
      }
    }
    if(invAnimals[index].num > 1){
      invAnimals[index].removeAnimal();
    } else {
      var first = invAnimals.slice(0, index);
      var second = invAnimals.slice(index + 1, invAnimals.length);
      invAnimals = [];
      for(var i = 0; i < first.length; i++)
        invAnimals.push(first[i]);
      for(var i = 0; i < second.length; i++)
        invAnimals.push(second[i]);
    }
  } else if(type == 'item'){
    if(isNaN(index)){
      for(var i = 0; i < invItems.length; i++){
        if(index == invItems[i].name){
          index = i;
        }
      }
    }
    if(invItems[index].num > 1){
      invItems[index].removeItem();
    } else {
      var first = invItems.slice(0, index);
      var second = invItems.slice(index + 1, invItems.length);
      invItems = [];
      for(var i = 0; i < first.length; i++)
        invItems.push(first[i]);
      for(var i = 0; i < second.length; i++)
        invItems.push(second[i]);
    }
  } else if(type == 'plant'){
    if(isNaN(index)){
      for(var i = 0; i < invSeeds.length; i++){
        if(index == invSeeds[i].type){
          index = i;
        }
      }
    }
    if(invSeeds[index].num > 1){
      invSeeds[index].removeAnimal();
    } else {
      var first = invSeeds.slice(0, index);
      var second = invSeeds.slice(index + 1, invSeeds.length);
      invSeeds = [];
      for(var i = 0; i < first.length; i++)
        invSeeds.push(first[i]);
      for(var i = 0; i < second.length; i++)
        invSeeds.push(second[i]);
    }
  }
}

function countInInv(type, item){
  var count = 0;
  if(type == 'animal'){
    for(var i = 0; i < invAnimals.length; i++){
      if(invAnimals[i].type == item.type){
        count = invAnimals[i].num;
      }
    }
  } else if(type == 'item'){
    for(var i = 0; i < invItems.length; i++){
      if(invItems[i].name == item.name){
        count = invItems[i].num;
      }
    }
  } else if (type == 'plant') {
      for (var i = 0; i < invSeeds.length; i++) {
          if (invSeeds[i].type == item.type) {
              count = invSeeds[i].num;
          }
      }
  }
  return count;
}

var TUT_ROOMS = ['rooms1', 'rooms2', 'rooms3', 'rooms4', 'rooms5', 'rooms6'];
var TUT_ANIMALS = ['animals1', 'animals2', 'animals3', 'animals4'];
var TUT_ITEMS = ['items1', 'items2', 'items3'];
var TUT_FOOTER = ['footer1', 'footer2'];
var tutImages = TUT_ROOMS;
var tutImageIndex = 0;
// tutorial menu functions
function tutTabClicked(tab){
  $('#tut-rooms').css('background-image', 'url("img/menu/squarebutton.png")');
  $('#tut-animals').css('background-image', 'url("img/menu/squarebutton.png")');
  $('#tut-items').css('background-image', 'url("img/menu/squarebutton.png")');
  $('#tut-footer').css('background-image', 'url("img/menu/squarebutton.png")');
  $('#tut-' + tab).css('background-image', 'url("img/menu/squarebuttonactive.png")');
  if(tab == 'rooms'){
    tutImages = TUT_ROOMS;
  } else if(tab == 'animals'){
    tutImages = TUT_ANIMALS;
  } else if(tab == 'items'){
    tutImages = TUT_ITEMS;
  } else if(tab == 'footer'){
    tutImages = TUT_FOOTER;
  }
  tutImageIndex = 0;
  $('#tut-frame').css('background-image', 'url("img/tut/' + tutImages[tutImageIndex] + '.png")');
  tutSwitchPage(0);
}

function tutSwitchPage(pages){
  tutImageIndex += pages;
  if(tutImageIndex < 0) tutImageIndex = 0;
  if(tutImageIndex >= tutImages.length) tutImageIndex = tutImages.length - 1;
  if(tutImageIndex == 0){
    $('#tut-prev').css('background-image', 'url("img/menu/squarebuttonactive.png")');
    $('#tut-next').css('background-image', 'url("img/menu/nextbutton.png")');
  } else if(tutImageIndex == tutImages.length - 1){
    $('#tut-prev').css('background-image', 'url("img/menu/prevbutton.png")');
    $('#tut-next').css('background-image', 'url("img/menu/squarebuttonactive.png")');
  } else {
    $('#tut-prev').css('background-image', 'url("img/menu/prevbutton.png")');
    $('#tut-next').css('background-image', 'url("img/menu/nextbutton.png")');
  }
  $('#tut-frame').css('background-image', 'url("img/tut/' + tutImages[tutImageIndex] + '.png")');
}

// retrieve the time elapsed between two dates
function getElapsedTime(first, second, format){
  if(format == 'milliseconds'){
    return second - first;
  } else if(format == 'seconds'){
    return (second - first) / 1000;
  } else if(format == 'minutes'){
    return ((second - first) / 1000) / 60;
  } else if(format == 'hours'){
    return (((second - first) / 1000) / 60) / 60;
  } else if(format == 'days'){
    return ((((second - first) / 1000) / 60) / 60) / 24;
  }
}

// function returns a random color
function generateColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function capitalizes the first letter of a string
function formatText(string) {
    var str = string.charAt(0).toUpperCase() + string.slice(1);
    return str.replace(/_/g, ' ');
}

// game loop update function
var lastSave = Date.now();
function update(){
  $('#header h2').html('$' + money + '&nbsp;&nbsp;&nbsp;lvl: ' + experience.level);
  for(var i = 0; i < rooms.length; i++){
    rooms[i].update();
  }
  if(Date.now() - lastSave >= 5 * minutes){
    saveData();
    lastSave = Date.now();
  }
}

// game loop render function
function render(){
  for(var i = 0; i < rooms.length; i++){
      rooms[i].render();
  }
}

// resizes several elements based on screen demensions
function doSizing(){
  $('#header').css('height', roomHeight);
  $('#footer').css('height', roomHeight + 10);
  $('#footer-toggle').css({
    'bottom': roomHeight - 15,
    'height': 23,
    'width': screenWidth / 5
  });
  $('#buy-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });
  $('#craft-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });
  $('.slot').css({
    'height': roomHeight,
    'width': roomHeight
  });
  $('.slot-2').css({
    'height': roomHeight,
    'width': roomHeight
  });
  $('.crow').css({
    'height': roomHeight + 5
  });
  $('#animals-tab').css({
    'height': roomHeight
  });
  $('#plants-tab').css({
    'height': roomHeight
  });
  $('#auxilary-tab').css({
    'height': roomHeight
  });
  $('#collect-floor').css({
    'height': roomHeight / 2,
    'width': roomWidth,
    'left': (screenWidth - roomWidth) / 2
  });
  $('#save-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });
  $('#cheat-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30,
    'left': roomHeight - 15
  });
  $('#cheat-label').css({
    'left': (roomHeight - 15)
  })
  $('#pause-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30,
    'left': 2 * (roomHeight - 15)
  });
  $('#pause-label').css({
    'left': 2 * (roomHeight - 15)
  })
  $('#item-dex').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30,
    'left': 3 * (roomHeight - 15)
  });
  $('#itemdex-label').css({
    'left': 3 * (roomHeight - 15)
  })
  $('#animal-dex').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30,
    'left': 4 * (roomHeight - 15)
  });
  $('#animaldex-label').css({
    'left': 4 * (roomHeight - 15)
  })
  $('#tutorial-button').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30,
    'left': 5 * (roomHeight - 15)
  });
  $('#tutorial-label').css({
    'left': 5 * (roomHeight - 15)
  });
  $('#items-lbl').css({
    'top': (roomHeight * 1.5) + 'px'
  });
  $('#crafting').css({
    'top': (roomHeight * 2) + 'px'
  });
  $('#crafting-inv').css({
    'top': (roomHeight * 4) + 'px'
  });
  $('#craft-btn').css({
    'top': (roomHeight * 2.8) + 'px'
  });
  $('#craft-next').css({
    'top': (roomHeight * 6.5) + 'px',
    'width': roomHeight * 0.8
  });
  $('#dex-title').css({
    'height': roomHeight,
    'font-size': roomHeight / 2.5
  });
  $('#tut-close').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });
  $('#tut-prev').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });
  $('#tut-next').css({
    'height': roomHeight - 30,
    'width': roomHeight - 30
  });

  // makes it so there is no white space after the end of the rooms
  $('document').append('<div id="extraspace"><br><br><br>' +
    '<br><br><br><br><br><br><br><br><br><br></div>');
  $('#extraspace').css({
    'width': '100%',
    'height': '100%',
    'background-color': '#000000'
  });
}

// does various resizes so the sprites look alright
function doSpriteSizing(){
  $('#craftmenu').css({
    'background-image': 'url("img/menu/craftmenu.png")',
    'background-size': 'auto ' + roomHeight + 'px',
    'image-rendering': 'pixelated'
  });
  $('#header').css({
    'background-image': 'url("img/menu/header.png")',
    'background-position': 'left bottom',
    'background-size':  roomHeight + 'px auto',
    'image-rendering': 'pixelated'
  });
  $('#footer').css({
    'background-image': 'url("img/menu/roommenu.png")',
    'background-size':  roomHeight + 'px auto',
    'image-rendering': 'pixelated'
  });
  $('#floormenu').css({
    'background-image': 'url("img/menu/roommenu.png")',
    'background-size':  roomHeight + 'px auto',
    'image-rendering': 'pixelated'
  });
  $('#buymenu').css({
    'background-image': 'url("img/menu/buymenu.png")',
    'background-position': 'top right',
    'background-size': 'auto ' + roomHeight + 'px',
    'image-rendering': 'pixelated'
  });

  // everytime the game loads it has a different background
  /**var backgrounds = 4;
  var backNum = randomNumber(1, backgrounds + 1);
  var backText = 'background' + backNum + '.png';
  $('#content').css({
    'background-image': 'url("img/menu/' + backText + '")'
  });**/
}

function defaultLoad(){
  money = 10000;
}

document.addEventListener("pause", onPause, false);
function onPause() {
    saveData();
}

function saveData(){
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM save;');
    tx.executeSql('DELETE FROM animals;');
    tx.executeSql('DELETE FROM locked;');
    tx.executeSql('DELETE FROM floors;');
    // saving money
    tx.executeSql("INSERT INTO save (field, value) VALUES ('money', '" + money + "')");
    tx.executeSql("INSERT INTO save (field, value) VALUES ('xp', '" + experience.xp + "')");
    tx.executeSql("INSERT INTO save (field, value) VALUES ('level', '" + experience.level + "')");
    if(firstPlay)
      tx.executeSql("INSERT INTO save (field, value) VALUES ('firstplay', 'true')");
    else
      tx.executeSql("INSERT INTO save (field, value) VALUES ('firstplay', 'false')");
    // saving items and animals
    for(var i = 0; i < invAnimals.length; i++){
      tx.executeSql('INSERT INTO animals (name, num, type) VALUES (?, ?, ?)',
        [invAnimals[i].type, invAnimals[i].num, 'animal']);
    }
    for(var i = 0; i < invSeeds.length; i++){
      tx.executeSql('INSERT INTO animals (name, num, type) VALUES (?, ?, ?)',
        [invSeeds[i].type, invSeeds[i].num, 'plant']);
    }
    for(var i = 0; i < invItems.length; i++){
      tx.executeSql('INSERT INTO animals (name, num, type) VALUES (?, ?, ?)',
        [invItems[i].name, invItems[i].num, 'item']);
    }
    // saving locked buy animals
    for(var i = 0; i < GLOBAL_ANIMALS.length; i++){
      tx.executeSql('INSERT INTO locked (animal, locked) VALUES (?, ?)',
                    [GLOBAL_ANIMALS[i].name, GLOBAL_ANIMALS[i].locked]);``
    }
    // saving rooms
    // fan = first animal - san = second animal - tan = third animal
    for(var i = 0; i < rooms.length; i++){
      var fan = rooms[i].getAnimal(1).type;
      var san = rooms[i].getAnimal(2).type;
      var tan = rooms[i].getAnimal(3).type;
      if(fan == undefined) fan = 'none';
      if(san == undefined) san = 'none';
      if(tan == undefined) tan = 'none';
      tx.executeSql('INSERT INTO floors (type, zindex, slot1, slot2, slot3, lastCollected, wait) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [rooms[i].type, rooms[i].z, fan, san, tan, rooms[i].lastCollected, rooms[i].wait]);
    }
  });
}

function loadData(callback){
  // loading data from db
  db.transaction(function (tx) {
    // loading money
    tx.executeSql('SELECT * FROM save;', [], function (tx, result) {
        for(var i = 0; i < result.rows.length; i++){
          var row = result.rows.item(i);
          if(row['field'] == 'money') money = parseInt(row['value']);
          if(row['field'] == 'xp') experience.xp = parseInt(row['value']);
          if(row['field'] == 'level') experience.level = parseInt(row['value']);
          if(row['field'] == 'firstplay'){
            if(row['value'] == 'true'){
              firstPlay = true;
            } else {
              firstPlay = false;
            }
          }
          experience.update();
          experience.unlockPlants();
        }
        // loading items and animals
        tx.executeSql('SELECT * FROM animals;', [], function (tx, result) {
          invAnimals = [];
          invSeeds = [];
          invItems = [];
          for(var i = 0; i < result.rows.length; i++){
            var row = result.rows.item(i);
            if(row['type'] == 'animal'){
              var animal = new Animal(row['name']);
              animal.num = parseInt(row['num']);
              invAnimals.push(animal);
            } else if(row['type'] == 'plant'){
              var plant = new Animal(row['name']);
              plant.num = parseInt(row['num']);
              invSeeds.push(plant);
            } else if(row['type'] == 'item'){
              var item = new Item(row['name']);
              item.num = parseInt(row['num']);
              invItems.push(item);
            }
          }
          // loading locked
          tx.executeSql('SELECT * FROM locked;', [], function (tx, result) {
            for(var i = 0; i < result.rows.length; i++){
              var row = result.rows.item(i);
              for(var j = 0; j < GLOBAL_ANIMALS.length; j++){
                if(GLOBAL_ANIMALS[j].name == row['animal']){
                  if(row['locked'] == 'false'){
                    GLOBAL_ANIMALS[j].locked = false;
                  } else {
                    GLOBAL_ANIMALS[j].locked = true;
                  }
                }
              }
            }
            // loading rooms
            tx.executeSql('SELECT * FROM floors;', [], function (tx, result) {
              for(var i = 0; i < rooms.length; i++){
                rooms[i].removeRoom();
              }
              rooms = [];
              for(var i = 0; i < result.rows.length; i++){
                var row = result.rows.item(i);
                var room = new Room(parseInt(row['zindex']), row['type']);
                var fan = row['slot1'];
                var san = row['slot2'];
                var tan = row['slot3'];
                if(fan != 'none' && fan != undefined) room.addAnimal(new Animal(fan), 1);
                if(san != 'none' && san != undefined) room.addAnimal(new Animal(san), 2);
                if(tan != 'none' && tan != undefined) room.addAnimal(new Animal(tan), 3);
                room.calculateWait();
                room.lastCollected = row['lastCollected'];
                addRoom(room);
              }

              // callback function
              if(callback != undefined){
                callback();
              }

            }, function(tx, error){
              console.log('error loading rooms');
              console.log('ERROR: ' + error.code + ': ' + error.message);
            });
          }, function(tx, error) {
            console.log('error loading locked animals');
            console.log('ERROR: ' + error.code + ': ' + error.message);
          });
        }, function(tx, error){
          console.log('error loading animals and items');
          console.log('ERROR: ' + error.code + ': ' + error.message);
        });
    }, function (tx, error) {
      console.log('error loading money');
      console.log('ERROR: ' + error.code + ': ' + error.message);
    });
  });
}

// "main function"
$('document').ready(function(){

  craftBench = new CraftingTable();
  experience = new xpBar();

  db = window.openDatabase("savedata.db", "1.0", "Save", 20000);
  db.transaction(function (tx) {
    // create all tables here
    //tx.executeSql('DROP TABLE save');
    tx.executeSql('CREATE TABLE IF NOT EXISTS save (field TEXT PRIMARY KEY, value TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS animals (' +
                    'name TEXT, num INT, type TEXT)');
    //tx.executeSql('DROP TABLE floors');
    tx.executeSql('CREATE TABLE IF NOT EXISTS floors (' +
                    'type TEXT, zindex INTEGER, slot1 TEXT, slot2 TEXT, slot3 TEXT, lastCollected INTEGER, wait INTEGER)');
    //tx.executeSql('DROP TABLE locked');
    tx.executeSql('CREATE TABLE IF NOT EXISTS locked (animal TEXT PRIMARY KEY, locked TEXT)');
  });
  loadData(function(){

    // hiding menus
    $('#floormenu').hide();
    $('#buymenu').hide();
    $('#craftmenu').hide();
    $('#dexmenu').hide();
    $('#tutorialmenu').hide();

    doSizing();
    doSpriteSizing();
    roomSlotClicks();
    craftSlotClicks();
    addClicks();
    toggleFooter('hide');

    // game loop
    setInterval(function(){
      if(!pause){
        update();
        render();
      }
    }, (1000 / 60));

    $('#splash-screen').remove();

    // if its the players first time playing
    if(firstPlay){
      var verify = new Popup('firstplay', 'View the tutorial in the bottom menu', false, function(){
        var verify = new Popup('objective', 'The objective of the game is to collect' +
            ' every plant, animal, and item', false, function(){
          firstPlay = false;
        });
      });
    }

  });

});
