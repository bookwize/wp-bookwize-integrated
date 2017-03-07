(function($) {
    'use strict';
    $("#bw_button_color").wpColorPicker();
    var $bookwize_hotel_id = $('#bookwize_hotel_id');


    // create multiple hote info calls
    // and store the repsonse in local storage and memory
    if ($bookwize_hotel_id.length && bookwize.properties.length) {
        // loop through properties and create the
        // promises for the call /hotels/info/{hotelId}
        $(bookwize.properties).each(function(index, hotel) {
            hotel_info_promises.push(get_hotel_info(hotel.hotelId));
        });

        $.when.apply($, hotel_info_promises).then(function() {
            var hotel_id_options = [];
            $(arguments).each(function(index, response) {
                hotels.push(response[0]);
                hotel_id_options.push({
                    id: response[0].info.id,
                    name: response[0].info.name
                });
            });

            $bookwize_hotel_id.append(
                create_options(hotel_id_options, $bookwize_hotel_id.data('value'))
            );
        });

        $bookwize_hotel_id.on('change', function(e) {
            try {
                var value = $(this).val();
                if (value === '') {
                    $bookwize_room_id.html('');
                    $bookwize_offer_id.html('');
                }
                populate_hotel_rooms(value, $bookwize_room_id);
                populate_hotel_offers(value, $bookwize_offer_id);
            } catch (e) {
                console.log(e.message);
            }
        });

        // for first page load
        $bookwize_hotel_id.trigger('change');
    }

})(jQuery);
