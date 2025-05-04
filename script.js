function onSubmit(token) {
    var url = $('#url').val().trim();
    if (!url) {
        alert("Please enter a URL.");
        grecaptcha.reset(); // reset captcha if needed
        return;
    }

    $('.loader').show();
    $('.temp_sec1').hide();

    $.ajax({
        url: 'data_handler.php',
        method: 'POST',
        data: {
            url: url,
            'g-recaptcha-response': token
        },
        dataType: 'json',
        success: function (data) {
            $('.loader').hide();

            if (data.success) {
                $('#ip').text(data.ip);
                $('#host').text(data.host);
                $('#city').text(data.city);
                $('#subd').text(data.region);
                $('#country').text(data.country);
                $('#whois').text(data.whois.slice(0, 1000) + '...');

                if (data.nameservers && data.nameservers.length > 0) {
                    $('#nsList').empty();
                    data.nameservers.forEach(ns => {
                        $('#nsList').append(`<li>${ns}</li>`);
                    });
                } else {
                    $('#nsList').html('<li>No name servers found.</li>');
                }

                $('.temp_sec1').css("display", "flex");
            } else {
                alert('Error: ' + data.message);
            }
        },
        error: function (xhr, status, error) {
            $('.loader').hide();
            console.error("AJAX Error:", status, error);
            alert("Something went wrong.");
        }
    });
}
