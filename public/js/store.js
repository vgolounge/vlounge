class StoreBlock {
    constructor(target='') {
        this.user = [];
        this.target = target;
		$(this.target).html("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");

        var out = "";

		var me = this;
        $.ajax({
			"url": "/api/Trade/GetSiteItems",
			"success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
		            var i = obj.response.items;
		            var length = Object.keys(i).length;

		            out += '<div style="font-size:0;">\n';
					if(length > 0) {
			            Object.keys(i).forEach(key => {
			                out += '<div class="card" id="item_' + i[key].id + '" style="display:inline-block;width:20%;vertical-align:top;font-size:1rem;">\n';
							out += '<div class="card-image">\n';
							out += '<figure class="image is-16by9">\n';
							out += '<img src="' + i[key].preview_urls['thumb_image'] + '" alt="' + i[key].name + '">\n';
							out += '</figure>\n';
							out += '</div>\n';
							out += '<div class="card-content">\n';
							out += '<div class="content">\n';
							out += '' + i[key].credits + ' credits\n';
							out += '<p style="font-weight:bold;">' + i[key].name + '</p>\n';
							if(vgoapp.loggedIn()) {
								out += '<p class="buy"><button class="do_buy button is-small is-primary" data-itemid="' + i[key].id + '">Buy</button></p>\n';
							}
							out += '</div>\n';
							out += '</div>\n';
							out += '</div>\n';
						});
					} else {
						out += '<div style="font-size:1rem;">No items found.</div>\n';
					}
					out += '</div>\n';

		            if(me.target) {
			            $(me.target).html(out);
			        }
				} else {
	                 console.log("Status:", obj.status, obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	        }
		});
    }
}

$(document).on("click", "button.do_buy", function() {
	$(this).prop('disabled', true).html("<div class='fa fa-spin fa-spinner'></div>");
	if(vgoapp.loggedIn()) {
		var itemid = $(this).data("itemid");

		$.ajax({
			"url": "/api/Store/BuyItem",
			"method": "POST",
			"data": {
				item_id: itemid
			},
			"success": function(res) {
				var obj = (res);
				if(obj.status === 1) {
					$("#item_" + itemid + " .image").fadeTo("slow", 0.50);
					$("#item_" + itemid + " p.buy").html('<a href="https://trade.onetruestage.com/trade-offers/' + res.response.offer_id + '" class="button is-small">View Trade Offer</a>');
					vgoapp.updateUserCredits(res.response.credits_remaining);
	            } else {
					console.log("Status:", obj.status, obj.message);
				}
	        }, "error": function(res) {
				var obj = (res);
				$("#item_" + itemid + " button.do_buy").prop('disabled', false);
				console.log("Status:", obj.status, obj.message);
	            console.log("Error");
	        }
		});
	}
});