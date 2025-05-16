const form = document.getElementById("form");
const inputElemIDs = [ "billInput", "percentageInput", "numberOfPeopleInput" ];
const billInputError = document.getElementById( "billInputError" );
const percentageInputError = document.getElementById( "percentageInputError" );
const numberOfPeopleInputError = document.getElementById( "numberOfPeopleInputError" );
const resetButton = document.getElementById( "resetButton" );
const errorMsgElements = {
    billInput: billInputError,
    percentageInput: percentageInputError,
    numberOfPeopleInput: numberOfPeopleInputError,
};

const validityFuncs = {
    billInput: isBillValid,
    percentageInput: isPercentageValid,
    numberOfPeopleInput: isNumOfPeopleValid,
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
            clearSelectedTip();
            
            if( e.target.id != "percentageInput" ){
                e.target.parentElement.classList.add( "selected-tip" );
                errorMsgElements.percentageInput.innerHTML = "";
                document.getElementById( "percentageInput" ).disabled = true;

                checkValidity();
            }

            toggleResetButton();
        });
    });

    resetButton.addEventListener( "click", clearAllFields );
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

    toggleResetButton();
    
    if( key != "Tab" && key != "Enter" ){
        errorMsgElements[ e.target.id ].innerHTML = "";
    } else {
        checkValidity();
    }
}

function checkValidity(){
    let areAllInputsValid = true;

    for( let elemID in validityFuncs ){
        let isValid = validityFuncs[ elemID ]();

        // console.log( elemID, isValid );
        areAllInputsValid = areAllInputsValid && isValid;
    }

    if( areAllInputsValid ){
        // console.log(`allInputsValid`);
        computeTip();
    } else {
        clearComputedValues();
    }
}

function isBillValid(e){
    const input = document.getElementById( "billInput" );
    let validity = input.validity;
    let isValid = true;
    
    // console.log(`validity`, validity)
    if( validity.rangeUnderflow || validity.rangeOverflow ){
        billInputError.innerHTML = "Should be 1 - 1000000";
        isValid = false;
    } else if( validity.stepMismatch ){
        billInputError.innerHTML = "Up to 2 decimal places only";
        isValid = false;
    } else if( validity.badInput ){
        billInputError.innerHTML = "Invalid Amount";
        isValid = false;
    } else if( input.value.trim() == "" ){
        isValid = false;
    }
    
    return isValid;
}

function isPercentageValid(e){
    const input = document.getElementById( "percentageInput" );
    const selectedTips = document.querySelectorAll( ".selected-tip" );
    let validity = input.validity;
    let isValid = true;

    if( selectedTips.length == 0 ){
        if( validity.rangeUnderflow || validity.rangeOverflow ){
            percentageInputError.innerHTML = "Should be 1 - 100";
            isValid = false;
        } else if( validity.badInput ){
            percentageInputError.innerHTML = "Invalid Percentage";
            isValid = false;
        } else if( input.value.trim() == "" ){
            isValid = false;
        }
    }

    return isValid;
}

function isNumOfPeopleValid(e){
    const input = document.getElementById( "numberOfPeopleInput" );
    let validity = input.validity;
    let isValid = true;

    if( validity.rangeUnderflow ){
        numberOfPeopleInputError.innerHTML = "Can't be zero";
        isValid = false;
    } else if( validity.badInput ){
        numberOfPeopleInputError.innerHTML = "Invalid Value";
        isValid = false;
    } else if( input.value.trim() == "" ){
        isValid = false;
    }

    return isValid;
}

function clearSelectedTip(){
    const selectedTips = document.querySelectorAll( ".selected-tip" );
    const percentageInput = document.getElementById( "percentageInput" );

    for( let i=0; i < selectedTips.length; i++ ){
        selectedTips[i].classList.remove( "selected-tip" );
    }

    percentageInput.value = "";
    percentageInput.removeAttribute( "disabled" );
}

function computeTip(){
    const formData = new FormData( form );
    const data = Object.fromEntries( formData );
    let values = {};

    Object.keys( data ).forEach((name) => {
        // console.log(`name`, name, data[name], typeof data[name])
        values[ name ] = data[name];
    });

    if( values.percentage == "" ){
        const selectedTip = document.querySelector( ".selected-tip > input" );
        values.percentage = selectedTip.value;
    }

    let pct = ( values.percentage / 100 );
    let tipAmount = values.bill * pct / values.numberOfPeople;
    let totalPerPerson = values.bill * ( 1 + pct ) / values.numberOfPeople;

    // console.log(`tipAmount`, tipAmount)
    // console.log(`totalPerPerson`, totalPerPerson)

    document.getElementById( "tipAmount" ).innerHTML = tipAmount.toFixed(2);
    document.getElementById( "totalAmount" ).innerHTML = totalPerPerson.toFixed(2);
}

function clearComputedValues(){
    document.getElementById( "tipAmount" ).innerHTML = "0.00";
    document.getElementById( "totalAmount" ).innerHTML = "0.00";
}

function areAllFieldsEmpty(){
    const selectedTips = document.querySelectorAll( ".selected-tip" );

    for( let i=0; i < inputElemIDs.length; i++ ){
        let elemID = inputElemIDs[i];
        let input = document.getElementById( elemID );

        if( elemID == "percentageInput" ){
            // console.log(`selectedTips.length`, selectedTips.length)
            if( selectedTips.length == 0 && input.value.trim() != "" ) return false;
            if( selectedTips.length > 0 ) return false;
        } else {
            if( input.value.trim() != "" ) return false;
        }
    }

    return true;
}

function toggleResetButton(){
    // console.log(`areAllFieldsEmpty?`, areAllFieldsEmpty())
    if( areAllFieldsEmpty() ){
        resetButton.setAttribute( "disabled", true );
    } else {
        resetButton.removeAttribute( "disabled" );
    }
}

function clearAllFields(){
    clearComputedValues();
    clearSelectedTip();

    for( let i=0; i < inputElemIDs.length; i++ ){
        let elemID = inputElemIDs[i];
        let input = document.getElementById( elemID );

        input.value = "";
        errorMsgElements[ elemID ].innerHTML = "";
    }

    resetButton.setAttribute( "disabled", true );
}


setupListeners();
