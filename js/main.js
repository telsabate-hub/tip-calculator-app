const form = document.getElementById("form");
const inputElemIDs = [ "billInput", "percentageInput", "numberOfPeopleInput" ];
const billInputError = document.getElementById( "billInputError" );
const percentageInputError = document.getElementById( "percentageInputError" );
const numberOfPeopleInputError = document.getElementById( "numberOfPeopleInputError" );
const errorMsgElements = {
    billInput: billInputError,
    percentageInput: percentageInputError,
    numberOfPeopleInput: numberOfPeopleInputError,
};

const validityFuncs = {
    billInput: checkBillValidity,
    percentageInput: checkPercentageValidity,
    numberOfPeopleInput: checkNumOfPeopleValidity,
};

function setupListeners(){
    inputElemIDs.forEach( (id) => {
        let elem = document.getElementById( id );

        elem.addEventListener( 'keydown', keydownListener );
        elem.addEventListener( 'keyup', keyupListener );
        elem.addEventListener( 'change', checkValidity );
    });

    const percentageButtons = document.getElementsByName( "percentage" );

    percentageButtons.forEach( (button) => {
        button.addEventListener( "click", function(e){
            e.target.parentElement.classList.add( "selected-tip" );
        });
    });
}

function keydownListener(e){
    let value = e.target.value;
    const key = e.key, id = e.target.id;
    const specialAllowedKeys = ["Tab", "Enter", "Backspace", "ArrowLeft", "ArrowRight"];
    const maxInputLength = {
        billInput: 6,
        percentageInput: 3,
        numberOfPeopleInput: 3,
    };
    const notAllowedKeys = [ "-", "+", "." ];
    if( id == "billInput" ) notAllowedKeys.splice(-1);
    
    if( !specialAllowedKeys.includes(key) ){
        if( value.length >= maxInputLength[id] || notAllowedKeys.includes(key) ) e.preventDefault();
    }
}

function keyupListener(e){
    const key = e.key;
    // console.log(`keyup`, key)
    
    if( key != "Tab" && key != "Enter" ){
        errorMsgElements[ e.target.id ].innerHTML = "";
    } else {
        checkValidity(e);
    }
}

function checkValidity(e){
    if( validityFuncs[ e.target.id ] ){
        validityFuncs[ e.target.id ](e);
    }
}

function checkBillValidity(e){
    let validity = e.target.validity;
    
    // console.log(`validity`, validity)
    if( validity.rangeUnderflow || validity.rangeOverflow ) billInputError.innerHTML = "Should be 1 - 1000000";
    else if( validity.stepMismatch ) billInputError.innerHTML = "Up to 2 decimal places only";
    else if( validity.badInput ) billInputError.innerHTML = "Invalid Amount";
    
}

function checkPercentageValidity(e){
    let validity = e.target.validity;

    if( validity.rangeUnderflow || validity.rangeOverflow ) percentageInputError.innerHTML = "Should be 1 - 100";
    else if( validity.badInput ) percentageInputError.innerHTML = "Invalid Percentage";
}

function checkNumOfPeopleValidity(e){
    let validity = e.target.validity;

    // console.log(`checkNumOfPeopleValidity`, validity)
    if( validity.rangeUnderflow ) numberOfPeopleInputError.innerHTML = "Can't be zero";
    else if( validity.badInput ) numberOfPeopleInputError.innerHTML = "Invalid Value";
}




setupListeners();
