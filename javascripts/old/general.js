$(document).ready(function () {
    var start_age = $("#start-age").val();
    var end_age = $("#end-age").val();
    $("#current-range").text('Age range: ' + start_age + " - " + end_age);

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 100,
        values: [start_age, end_age],
        slide: function (event, ui) {
            $("#current-range").text('Age range: ' + ui.values[0] + " - " + ui.values[1]);
            $("#start-age").val(ui.values[0]);
            $("#end-age").val(ui.values[1]);
        }
    });

    // Validate select user with country
    $("#btn-send-form").click( function(e) {
        var selected_user = $("#user_id option:selected").val();
        if (selected_user == '') {
            alert('Please, select content author');
            e.preventDefault();
        } else {
            // Check country selected
            var selected_country = $("#country_id_chosen .chosen-choices .search-choice");
            if (selected_country.size() == 0) {
                alert('Please, select country');
                e.preventDefault();
            }
        }
    });
});