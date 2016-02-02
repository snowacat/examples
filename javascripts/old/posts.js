//= require jquery.min.js
//= require chosen.jquery.js
//= require jquery_ujs
//= require jquery-live-preview
//= require jquery-ui.js
//= require general.js

var type_content;
var file_format;
var fileName;
var previewName;

$(document).ready(function() {

    // Validate for media file select
    $("input#content_file").change(function (){
        fileName = $(this).val();
        var fileRequired = $('.file-required');

        if (fileName == '') {
            fileRequired.text('Please, choose media file');
            $('.content-file').addClass('error-custom');
            $('.content-file-name').text('');
        } else {
            fileRequired.text('');
            $('.content-file').removeClass('error-custom');

            checkFiles();
        }
    });

    $("input#image_file").change(function (){
        previewName = $(this).val();
        $('.file-name-preview').text(previewName);
        checkFiles();
    });

    $("#btn-send-form").click( function(e) {
        var selected_file = $('.content-file-name').text();

        if (selected_file == '') {
            $('.content-file').addClass('error-custom');
            $('.file-required').text('Please, choose media file');
            e.preventDefault();
        } else {
            $('.content-file').removeClass('error-custom');
            $('.file-required').text('');

            if (checkFiles() == false) {
                e.preventDefault();
            }
        }
    });


    $('.livepreview').livePreview();

    type_content = $("#media_type_id option:selected").val();
    if (type_content == 'image/jpeg') {
        $("#preview-btn").hide();
        $('#content_file').attr('accept','image/jpeg');
    } else {
        $('#content_file').attr('accept','video/mp4');
        $("#preview-btn").show();
    }

    $('#media_type_id').on('change', function() {
        type_content = $("#media_type_id option:selected").val();

        if (type_content == 'image/jpeg') {
            $('#content_file').attr('accept','image/jpeg');
            $("#preview-btn").hide();
            $('.file-name-preview').text('');
        } else {
            $('#content_file').attr('accept','video/mp4');
            $("#preview-btn").show();
        }
    });

    // Show file name
    $('#image_file').change(
        function(e){
            $('.file-name-preview').text(e.target.files[0].name);
        }
    );

    $('#content_file').change(
        function(e){
            $('.content-file-name').text(e.target.files[0].name);
        }
    );

    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {allow_single_deselect: true},
        '.chosen-select-no-single': {disable_search_threshold: 10},
        '.chosen-select-no-results': {no_results_text: 'Oops, nothing found!'},
        '.chosen-select-width': {width: "95%"}
    };

    for (var selector in config) {
        $(selector).chosen(config[selector]);
    };
});

function checkFiles() {
    var fileRequired = $('.file-required');
    file_format = fileName.split('.').pop();
    if (type_content == 'image/jpeg') {
        $('.file-name-preview').text('');

        if (file_format != 'jpeg' && file_format != 'jpg') {
            fileRequired.text('Please, choose correct media file: jpeg or jpg');
            $('.content-file').addClass('error-custom');
            return false;
        } else {
            fileRequired.text('');
            $('.content-file').removeClass('error-custom');
            return true;
        }
    } else if (type_content == 'video/mp4') {
        if (file_format != 'mp4') {
            fileRequired.text('Please, choose correct media file: mp4');
            $('.content-file').addClass('error-custom');
            return false;
        } else {
            fileRequired.text('');
            $('.content-file').removeClass('error-custom');

            // Validate preview for video
            var selected_preview = $('.file-name-preview').text();

            if (selected_preview == '') {
                $('.image-file').addClass('error-custom');
                $('.preview-required').text('Please, choose preview for video');
                return false;
            } else {
                // Only jpeg and jpg
                previewFormat = previewName.split('.').pop();
                if (previewFormat != 'jpeg' && previewFormat != 'jpg') {
                    $('.image-file').addClass('error-custom');
                    $('.preview-required').text('Please, choose correct preview for video: jpeg or jpg');
                    return false;
                } else {
                    $('.image-file').removeClass('error-custom');
                    $('.preview-required').text('');
                    return true;
                }
            }
        }
    } else {
        fileRequired.text('Please, choose correct media file');
        $('.content-file').addClass('error-custom');
        return false;
    }

}

