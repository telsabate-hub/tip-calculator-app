const billInput = document.getElementById( "billInput" );

billInput.addEventListener( 'keydown', function(e){
    if( ( isNaN(e.key) || e.key == " " ) && e.key != "Backspace" && e.key != "." ) {
        e.preventDefault();
    }
});