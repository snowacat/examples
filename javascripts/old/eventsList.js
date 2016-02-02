//= require jquery.min.js
//= require jquery_ujs

$(document).ready(function() {
    $("#paid").click(function(){
        if ($('#paid').is(":checked")) {
            window.location.replace('/event?paid=true');
            $("#paid").checked(false);
        }
        else {
            window.location.replace('/event');
            $("#paid").checked(true);
        }
    });
});