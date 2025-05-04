$(document).ready(function () {
    $('#checkBtn').on('click', function () {
        var url = $('#url').val().trim();
        if (!url) return alert("Please enter a URL.");

        // Show loader, hide content
        $('.loader').show();

        $.ajax({
            url: 'data_handler.php',
            method: 'POST',
            data: { url: url },
            dataType: 'json',
            success: function (data) {
                $('.loader').hide(); // Hide loader
                if (data.success) {
                    $('#ip').text(data.ip);
                    $('#host').text(data.host);
                    $('#city').text(`${data.city}`);
                    $('#subd').text(`${data.region}`);
                    $('#country').text(`${data.country}`);
                    $('#whois').text(data.whois.slice(0, 1000) + '...');

                    // ✅ Show name servers inside success block
                    if (data.nameservers && data.nameservers.length > 0) {
                        $('#nsList').empty();
                        data.nameservers.forEach(ns => {
                            $('#nsList').append(`<li>${ns}</li>`);
                        });
                    } else {
                        $('#nsList').html('<li>No name servers found.</li>');
                    }

                    $('.temp_sec1').css("display", "flex"); // Show content after success
                } else {
                    alert('Error: ' + data.message);
                }
            },
            error: function (xhr, status, error) {
                $('.loader').hide();
                console.error("AJAX Error:", status, error);
                alert("Something went wrong. Check console.");
            }
        });
    });
});
