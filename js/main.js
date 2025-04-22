const billInput = document.getElementById( "billInput" );
const billInputError = document.getElementById( "billInputError" );

billInput.addEventListener( 'keydown', function(e){ 
    let value = e.target.value;
    const key = e.key;
    const specialAllowedKeys = ["Tab", "Enter", "Backspace"];
    const notAllowedKeys = [ "-", "+" ];

    if( !specialAllowedKeys.includes(key) ){
        // console.log(`value`, value)
        if( value.length > 6 || notAllowedKeys.includes(key) ) e.preventDefault();
    }
});

billInput.addEventListener( 'keyup', function(e){ 
    // console.log(`keyup`, e.target.value.length)
    const key = e.key;

    if( key != "Tab" && key != "Enter" ){
        billInputError.innerHTML = "";
    } else {
        checkBillValidity(e);
    }
});

billInput.addEventListener( 'change', function(e){ 
    checkBillValidity(e);
});


function checkBillValidity(e){
    let validity = e.target.validity;
    
    // console.log(`validity`, validity)
    if( validity.rangeUnderflow || validity.rangeOverflow ) billInputError.innerHTML = "Should be 1 - 1000000";
    else if( validity.stepMismatch ) billInputError.innerHTML = "Up to 2 decimal places only";
    else if( validity.badInput ) billInputError.innerHTML = "Invalid Amount";
    
}
