"use strict";

// Globals - player should be renamed to GAME...?
var totalAmountOfClicks = 0;
var player = {
    //level: 0,    
    helpers: [],
    currentProductionValue: 0,
    CalculateTotalProductionValue: function () {
        this.currentProductionValue = player.helpers.reduce(function (accumulator, helper) {
            return accumulator += helper.productionValue;
        }, 0);
        return this.currentProductionValue;
    },
    OnLevelUp: function () {
        console.error(new Error("Function not implemented"));
    },
    /*resourceGeneratedPerClick: 1,*/
};
player.helpers.HasHelperWithId = function (id) {
    var has = false;
    if (player.helpers.length >= 1)
        player.helpers.forEach((x) => {
            if (x.id === id) has = true;
        });
    return has;
}

//informs how many helpers with a specific ID there are in the helpers list
//which means: how many helpers of that ID were already bought.
player.helpers.NumberOfHelpersById = function (id) {
    var count = 0;
    player.helpers.forEach(x => {
        if (x.id == id) {
            count++;
        }
    })
    return count;
}
//returns the total amount that helpers of same ID will produce
player.helpers.TotalProductionByHelperId = function (id) {
    return player.helpers.filter(helper => helper.id === id).reduce(function (accumulator, helper) {
        return accumulator += helper.productionValue;
    }, 0);
}

// ###########
/**
 * GAME SETTINGS 
 */
//TODO: move this to a function inside a GAME Object

/**
 * Updates the interface with the current quantity of coins and
 * max coins.
 */
function UIUpdateCoinsCount() {
    //console.log(`UIUpdateCoinsCount called. MaxCoins: ${resourceManager.maxCoins}  - CurrentCoins: ${resourceManager.coins}`);
    document.getElementById(__config.ui_max_coins).innerText = ` ${resourceManager.maxCoins} `;
    document.getElementById(__config.ui_coins).innerText = ` ${resourceManager.coins} `;
}


function UIUpdateRPC() {
    //rpc should use __config.rpc instead of a direct value
    document.getElementById('rpc').innerText = ` ${helperManager.CalculateTotalProductionValue()} `;
}

//TODO: move this for a config function inside a GAME Object
var playArea = document.getElementById(__config.ui_play_area);
playArea.addEventListener('click', function () {    
    resourceManager.Produce(1);
    //should extend the total amount of clicks too

});

// UI (move this and other UI related functions to a UI Handler)
playArea.style.backgroundImage = 'url(' + __custom_settings.playArea_image + ')';



function UIUpdateHelpersList() {    
    if (helperManager.helpers.length < 1)    
        return;
    var ui_helpers_List = document.getElementById(__config.ui_helpers_list);
    ui_helpers_List.innerHTML = "";
    
    helperManager.helpers.forEach(element => {
        ui_helpers_List.appendChild(CreateHelperUIListElement(element));
    });
}

/**
 * TODO: This function clearly should be split in many others.
 * TODO: AND start with UI
 * @param {*} helperElement 
 */
function CreateHelperUIListElement(helperElement) { /* visual */
    var ui_helper_element = document.createElement("li");
    //header - helper name
    ui_helper_element.classList += "ui-helper-list-element";
    var ui_helper_name = document.createElement("span");
    ui_helper_name.classList += "ui-helper-name";
    ui_helper_name.innerText = helperElement.name;
    //image
    var ui_helper_graphic = document.createElement('img');
    ui_helper_graphic.classList += "ui-helper-graphic-representation";
    ui_helper_graphic.src = helperElement.graphicRepresentation;
    //helper info
    var ui_helper_info = document.createElement("div");
    ui_helper_info.classList += "ui-helper-info";
    ui_helper_info.innerText = "Price: " + helperElement.buyPrice;
    ui_helper_info.innerText += "Production: " + player.helpers.TotalProductionByHelperId(helperElement.id);
    //add to where it belongs
    ui_helper_element.appendChild(ui_helper_name);
    ui_helper_element.appendChild(ui_helper_graphic);
    ui_helper_element.appendChild(ui_helper_info);
    ui_helper_element.id = "helper-" + helperElement.id;
    /* logic */
    //only allow to buy a helper if it is not a unique already bought
    if (!helperElement.isUnique || !player.helpers.HasHelperWithId(helperElement.id)) {
        var ui_helper_btn_buy = document.createElement('a');
        ui_helper_btn_buy.href = "#";
        ui_helper_btn_buy.classList += "ui-helper-btn-buy"
        ui_helper_btn_buy.appendChild(document.createTextNode("Buy"));
        ui_helper_btn_buy.id = "buy-helper-" + helperElement.id;
        ui_helper_btn_buy.onclick = function () {
            var onItemBoughtEvent = new CustomEvent('OnItemBought', {
                detail: helperElement
            });
            document.dispatchEvent(onItemBoughtEvent);
        };
        ui_helper_element.appendChild(ui_helper_btn_buy);
    }

    return ui_helper_element;
}


/**
 * Custom settings are defined by the game developer. 
 */
function ApplyCustomSettings() {
    document.getElementById(__config.ui_resource_name).innerText = __custom_settings.resource_name;
    document.getElementById(__config.ui_max_resource_name).innerText = __custom_settings.max_resource_name;
    document.getElementById(__config.ui_helpers_list_name).innerText = __custom_settings.helpers_list_name;
}

//InitHelpers();
var helperManager = new HelperManager();
helperManager.InitHelpers();
ApplyCustomSettings();
//To run on every interaction/based on timer:
UIUpdateHelpersList();