import './alerts.html';
import './alerts.less';


const showConfirmationAlert = function showConfirmationAlert(title, error, top) {
    console.log("Show Alert!");

    $("#success-alert").animate({right: "-50%"}, 0, function() {

        $("#success-alert>strong").text(title);

        $("#success-alert").css("margin-top", top);

        if (error) $("#success-alert").removeClass('alert-success').addClass('alert-danger');
        $("#success-alert").show().animate({ right: "0" });
        $("#success-alert").fadeTo(3000, 1000).animate({ right: "-50%" }, 500, function() {
            $("#success-alert").hide();
            if (error) $("#success-alert").removeClass('alert-danger').addClass('alert-success');
        });


    });

}


Template.App_alerts.onRendered(function() {

    $('#success-alert').on('showAlert', function(event, title, error, top) {
        showConfirmationAlert(title, error, top);
    });

});

Template.App_alerts.events({
    'click .close': function(event, template) {

        $("#success-alert").hide();
    }
});
