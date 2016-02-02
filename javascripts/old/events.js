//= require jquery.min.js
//= require jquery.datetimepicker
//= require jquery.validate.js
//= require jquery.validate.additional-methods
//= require chosen.jquery.js
//= require jquery_ujs
//= require jquery-ui.js
//= require general.js

// Map options
var DEFAULT_LATITUDE = 0;
var DEFAULT_LONGITUDE = 0;
// Default zoom
var ZOOM = 13;
// Small zoom, if geolocation switch off in browser
var ERROR_ZOOM = 1;

var map;
var markers = [];

$(document).ready(function () {
    // Config for countries box
    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {allow_single_deselect: true},
        '.chosen-select-no-single': {disable_search_threshold: 10},
        '.chosen-select-no-results': {no_results_text: 'Oops, nothing found!'},
        '.chosen-select-width': {width: "95%"}
    };

    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    // Validate edit form
    $("#editForm").validate({
        rules: {
            name: {
                required: true,
                rangelength: [0, 255]
            },
            address: {
                rangelength: [0, 255]
            },
            payment_amount: {
                money: true
            },
            start_date: {
                required: true
            },
            end_date: {
                required: true
            }
        },
        errorClass: "error",
        validClass: "valid",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element).parent().removeClass().addClass('control-group error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).parent().removeClass().addClass('formBox');
        }
    });

    // Click button "Approve"
    $("#btnApprove").click(function () {
        var currentValue = $('#eventApprove').val();
        if (currentValue == "true") {
            $("#eventApprove").val("false");
            $("#btnApprove").html('Approve').removeClass("btn btn-warning").addClass("btn btn-success");
        }
        else {
            $("#eventApprove").val("true");
            $("#btnApprove").html('Disapprove').removeClass("btn btn-success").addClass("btn btn-warning");
        }
    });

    // Start Date Time Picker
    $('#pickerStartTime').datetimepicker({
        lang: 'en',
        minDate: new Date()
    });

    // End Date Time Picker
    $('#pickerEndTime').datetimepicker({
        lang: 'en',
        minDate: new Date()
    });

    // Validate password create form
    $("#passwordCreateForm").validate({
        rules: {
            password: {
                required: true,
                rangelength: [0, 255]
            },
            passwordConfirmation: {
                required: true,
                rangelength: [0, 255]
            }
        },
        errorClass: "error",
        validClass: "valid",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element).parent().removeClass().addClass('control-group error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).parent().removeClass().addClass('fieldBox');
        }
    });

    // Money validate method
    jQuery.validator.addMethod(
        "money",
        function (value, element) {
            var isValidMoney = /^\d{0,50}(\.\d{0,50})?$/.test(value);
            return this.optional(element) || isValidMoney;
        }, 'Please enter a valid amount.'
    );

    // End time must be greater than start time
    jQuery.validator.addMethod("greaterThan", function (value, element, params) {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return new Date(value) > new Date($(params).val());
        }
        return isNaN(value) && isNaN($(params).val()) || (Number(value) > Number($(params).val()));
        }, 'Must be greater than start time.'
    );

    $("#pickerEndTime").rules('add', { greaterThan: "#pickerStartTime" });

    // Show paid box, if checkbox checked
    // Change true/false in hidden approve field
    $("#paid").click(function () {
        $(".approve").toggle();
        $("#paymentWrapper").toggle(300);

        if ($('#paid').is(":checked")) {
            $("#eventApprove").val("true");
            $("#btnApprove").html("Disapprove").removeClass("btn btn-success").addClass("btn btn-warning");
        }
        else {
            $("#eventApprove").val("false");
            $("#btnApprove").html("Approve").removeClass("btn btn-warning").addClass("btn btn-success");
        }
    });

    if ($('#paid').is(":checked")) {
        $(".approve").show();
        $("#paymentWrapper").show();
    }
    else {
        $(".approve").hide();
        $("#paymentWrapper").hide();
    }

    // Initialize map
    google.maps.event.addDomListener(window, 'load', initialize);
});

function initialize() {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function geoSuccess(position) {
    // Get coords from hide inputs if this edit page. It need for draw map marker
    var inputLatitude = $('#eventLatitude').val();
    var inputLongitude = $('#eventLongitude').val();

    // Draw map and place marker with latitude and longitude values from current event
    if ((inputLatitude != null && inputLatitude != "" && inputLatitude != 0) && (inputLongitude != null && inputLongitude != "" && inputLongitude != 0)) {
        // Draw map with current markers coords
        drawMap(parseFloat(inputLatitude), parseFloat(inputLongitude), ZOOM);
        // Set marker
        var eventLatlng = new google.maps.LatLng(inputLatitude, inputLongitude);
        placeMarker(eventLatlng);
    }
    else {
        // If this edit/create page without marker. Draw map and marker with default coords.
        drawMap(position.coords.latitude, position.coords.longitude, ZOOM);
        // Set marker
        var eventLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        placeMarker(eventLatlng);
    }
}

function geoError(error) {
    // Get coords from hide inputs if this edit page
    var inputLatitude = $('#eventLatitude').val();
    var inputLongitude = $('#eventLongitude').val();

    if ((inputLatitude != null && inputLatitude != "" && inputLatitude != 0) && (inputLongitude != null && inputLongitude != "" && inputLongitude != 0)) {
        drawMap(parseFloat(inputLatitude), parseFloat(inputLongitude), ZOOM);
        var eventLatlng = new google.maps.LatLng(inputLatitude, inputLongitude);
        placeMarker(eventLatlng);
    }
    else {
        drawMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, ERROR_ZOOM);
    }
}

function drawMap(latitude, longitude, zoom) {
    // Map options
    var mapOptions = {
        zoom: zoom,
        center: { lat: latitude, lng: longitude},
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(map, 'click', function (event) {
        // Clear old marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        // Draw new marker
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    // Draw marker
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP
    });
    markers.push(marker);

    // Show in form new event coords. It need for update event. Because we get event coords from hide inputs.
    $("#eventLatitude").val(location.lat());
    $("#eventLongitude").val(location.lng());
}