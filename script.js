$(document).ready(function () {
    // Check if data exists in localStorage and populate it
    if (localStorage.getItem("websiteData")) {
        var storedData = JSON.parse(localStorage.getItem("websiteData"));
        $('#ip').text(storedData.ip);
        $('#host').text(storedData.host);
        $('#city').text(storedData.city);
        $('#subd').text(storedData.region);
        $('#country').text(storedData.country);
        $('#whois').text(storedData.whois);

        // Populate name servers
        if (storedData.nameservers && storedData.nameservers.length > 0) {
            $('#nsList').empty();
            storedData.nameservers.forEach(ns => {
                $('#nsList').append(`<li>${ns}</li>`);
            });
        } else {
            $('#nsList').html('<li>No name servers found.</li>');
        }

        $('.temp_sec1').css("display", "flex"); // Show content
    }

    // On button click, fetch data
    $('#checkBtn').on('click', function () {
        var url = $('#url').val().trim();
        if (!url) return alert("Please enter a URL.");

        // Show loader, hide content
        $('.loader').show();
        $('.temp_sec1').hide();

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

                    // Save data to localStorage
                    var websiteData = {
                        ip: data.ip,
                        host: data.host,
                        city: data.city,
                        region: data.region,
                        country: data.country,
                        whois: data.whois.slice(0, 1000) + '...',
                        nameservers: data.nameservers || []
                    };
                    localStorage.setItem("websiteData", JSON.stringify(websiteData));

                    // Show content after success
                    $('.temp_sec1').css("display", "flex");
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
