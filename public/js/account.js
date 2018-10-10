class AccountBlock {
    constructor(target='') {
        this.user = [];
        this.target = target;
        var me = this;
        $.ajax({
	        "url": "/api/User/GetUser",
	        "success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
		            me.user = obj.response.user;

		            if(me.target) {
		                $(me.target).html(me.render());
		            }
	            } else {
	                 console.log("Status:", obj.status, obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	        }
        });
    }

    render() {
        var out = "";

        if(vgoapp.loggedIn()) {
	        out += '<div id="account">\n';
	        out += '<div><strong>' + this.user.name + '</strong></div>\n';
	        out += '<div>Credits: ' + this.user.credits + '</div>\n';

	        out += '<div class="tabs">\n';
	        out += '<ul>\n';
	        out += '<li data-tab="1" class="is-active"><a>Account Settings</a></li>\n';
	        out += '<li data-tab="2"><a>Transaction History</a></li>\n';
	        out += '<li data-tab="3"><a>Bet History</a></li>\n';
	        out += '<li data-tab="4"><a>Deposit</a></li>\n';
	        out += '<li data-tab="5"><a>Pending Withdrawals</a></li>\n';
	        out += '</ul>\n';
	        out += '</div>\n';

	        out += '<div class="tab-content-account">\n';
	        out += '<div data-content="1" id="tab_1" class="is-active">\n';
	        out += '<div class="field">\n';
	        out += '<label class="label">Trade Link</label>\n';
	        out += '<div class="control">\n';
	        out += '<input id="tradelink" name="tradelink" class="input" type="text" placeholder="Trade Link" value="' + $.trim(this.user.tradelink) + '">\n';
	        out += '</div>\n';
	        out += '<p class="help">Can be found <a href="https://trade.onetruestage.com/settings" target="_blank">here</a>.</p>\n';
	        out += '</div>\n';
	        out += '<div class="control">\n';
	        out += '<button id="tradelink_save" class="button is-primary">Save</button>\n';
	        out += '</div>\n';
	        out += '</div>\n';
	        out += '<div data-content="2" id="tab_2">\n';
	        out += '';
	        out += '</div>\n';
	        out += '<div data-content="3" id="tab_3">\n';
	        out += '';
	        out += '</div>\n';
	        out += '<div data-content="4" id="tab_4">\n';
	        out += '';
	        out += '</div>\n';
	        out += '<div data-content="5" id="tab_5">\n';
	        out += '';
	        out += '</div>\n';
	        out += '</div>\n';
			out += '<style type="text/css">\n';
			out += '.tab-content-account > div {\n';
			out += 'display: none;\n';
			out += '}\n';
			out += '.tab-content-account > div.is-active {\n';
			out += 'display: block;\n';
			out += '}\n';
			out += '</style>\n';
	        out += '</div>\n';
	        out += '<br>\n';
        }

        return out;
    }

    transactions() {
    	var tab = "#tab_2";
		$.ajax({
			"url": "/api/User/GetTransactions",
			"success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
		            var transactions = obj.response.transactions;
		            var length = Object.keys(transactions).length;

		            var out = "";
		            out += '<table border="1" style="table-layout: fixed;" class="table is-fullwidth"><thead>\n';
			        out += '<tr>\n';
			        out += '<th width="50">#</th>\n';
			        out += '<th width="200">Type</th>\n';
			        out += '<th>Items</th>\n';
			        out += '<th width="150">Time</th>\n';
			        out += '<th width="150">Credits</th>\n';
			        out += '</tr>\n';
			        out += '</thead>\n';
					out += '<tbody>\n';
		            if(length > 0) {
						Object.keys(transactions).forEach(key => {
					        out += '<tr>\n';
					        out += '<td>' + transactions[key].id + '</td>\n';
					        out += '<td>';
					        if(transactions[key].type === 1) {
								 out += 'Deposit';
					        } else if(transactions[key].type === 2) {
								 out += 'Withdraw';
					        } else if(transactions[key].type === 3) {
								 out += 'Store Purchase';
					        } else if(transactions[key].type === 8) {
								 out += 'Complimentary Credits';
					        } else {
					        	out += 'Unknown';
					        }
					        out += '</td>\n';
					        out += '<td>';
					        var items = [];
					        if(transactions[key].items.length > 0) {
								transactions[key].items.forEach(function(entry) {
									items.push(entry.name);
								});
								out += items.join('<br>\n');
					        }
					        out += '</td>\n';
					        out += '<td>' + moment(transactions[key].timestamp).format("DD-MM-YYYY HH:mm") + '</td>\n';
					        out += '<td>';
					        if(transactions[key].type !== 2) {
					            out += transactions[key].credits + ' credits';
					        }
					        out += '</td>\n';
					        out += '</tr>\n';
						});
					} else {
						out = 'No transactions found.\n';
					}
			        out += '</tbody></table>\n';
					$(tab).html(out);
				} else {
	                 console.log("Status:", obj.status, obj.message);
	                 $(tab).html("Error: " + obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	            $(tab).html("Error");
	        }
		});
    }

    bets() {
    	var tab = "#tab_3";
		$.ajax({
			"url": "/api/User/GetBets",
			"success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
		            var bets = obj.response.bets;
		            var length = Object.keys(bets).length;

		            var out = "";
		            out += '<table border="1" style="table-layout: fixed;" class="table is-fullwidth"><thead>\n';
			        out += '<tr>\n';
			        out += '<th class="is-1">#</th>\n';
			        out += '<th class="is-1">Match</th>\n';
			        out += '<th class="is-1">Pick</th>\n';
			        out += '<th class="is-1">Credits</th>\n';
			        out += '<th class="is-1">Time</th>\n';
			        out += '<th class="is-1">Status</th>\n';
			        out += '</tr>\n';
			        out += '</thead>\n';
					out += '<tbody>\n';
					if(length > 0) {
			            Object.keys(bets).forEach(key => {
					        out += '<tr>\n';
					        out += '<td class="is-1">' + bets[key].id + '</td>\n';
					        out += '<td class="is-1">' + bets[key].match_id + '</td>\n';
					        out += '<td class="is-1">' + bets[key].pick + '</td>\n';
					        out += '<td class="is-1">' + bets[key].amount + '</td>\n';
					        out += '<td class="is-1">' + moment(bets[key].created_at).format("DD-MM-YYYY HH:mm") + '</td>\n';
					        out += '<td class="is-1">';
					        switch(bets[key].status) {
							    case 1:
							        out += 'Active';
							        break;
							    case 2:
							        out += 'Paid';
							        break;
							    case 3:
							        out += 'Canceled';
							        break;
							    default:
							        out += 'Unknown';
							}
					        out += '</td>\n';
					        out += '</tr>\n';
						});
					} else {
						out = 'No bets found.\n';
					}
					out += '</tbody></table>\n';
					$(tab).html(out);
				} else {
	                 console.log("Status:", obj.status, obj.message);
	                 $(tab).html("Error: " + obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	            $(tab).html("Error");
	        }
		});
    }

    deposit() {
    	var tab = "#tab_4";
		$.ajax({
			"url": "/api/Trade/GetUserItems",
			"success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
		            var i = obj.response.items;
		            var length = Object.keys(i).length;

		            var out = "";
		            out += '<div class="control">\n';
		            out += '<button id="do_deposit" class="button is-primary" disabled>Deposit Selected</button>\n';
		            out += '</div>\n';
		            out += '<br>\n';
		            out += '<div style="font-size:0;">\n';
					if(length > 0) {
			            Object.keys(i).forEach(key => {
			                out += '<div class="card" id="item_' + i[key].id + '" style="display:inline-block;width:20%;vertical-align:top;font-size:1rem;">\n';
							out += '<label class="checkbox">\n';
							out += '<div class="card-image">\n';
							out += '<figure class="image is-16by9">\n';
							out += '<img src="' + i[key].preview_urls['thumb_image'] + '" alt="' + i[key].name + '">\n';
							out += '</figure>\n';
							out += '</div>\n';
							out += '<div class="card-content">\n';
							out += '<div class="content">\n';
							out += '<div style="float:right;"><input type="checkbox" name="items[]" value="' + i[key].id + '"></div>\n';
							out += '' + i[key].credits + ' credits\n';
							out += '<p style="font-weight:bold;">' + i[key].name + '</p>\n';
							out += '</div>\n';
							out += '</div>\n';
							out += '</label>\n';
							out += '</div>\n';
						});
					} else {
						out = '<div style="font-size:1rem;">No items found.</div>\n';
					}
					out += '</div>\n';
					$(tab).html(out);
				} else {
	                 console.log("Status:", obj.status, obj.message);
	                 $(tab).html("Error: " + obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	            $(tab).html("Error");
	        }
		});
    }

	pending() {
		var tab = "#tab_5";
    	$.ajax({
			"url": "/api/Trade/GetUserPending",
			"success": function(res) {
	            var obj = (res);
	            if(obj.status === 1) {
	            	var i = obj.response.items;
		            var length = Object.keys(i).length;

		            var out = "";
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
							out += '<p style="font-weight:bold;">' + i[key].name + '</p>\n';
							if(i[key].offer.status === 1 && i[key].offer.time_expires > moment().format('X')) {
								out += '<p class="offer"><a href="https://trade.onetruestage.com/trade-offers/' + i[key].offer.id + '" class="button is-small is-primary">View Trade Offer</a></p>\n';
							} else {
								out += '<p class="offer"><button class="do_resend button is-small" data-itemid="' + i[key].id + '">Resend Trade Offer</button></p>\n';
							}
							out += '</div>\n';
							out += '</div>\n';
							out += '</div>\n';
						});
					} else {
						out = '<div style="font-size:1rem;">No pending withdrawals found.</div>\n';
					}
					out += '</div>\n';
					$(tab).html(out);
				} else {
	                 console.log("Status:", obj.status, obj.message);
	                 $(tab).html("Error: " + obj.message);
	            }
	        }, "error": function() {
	            console.log("Error");
	            $(tab).html("Error");
	        }
		});
    }
}

var items = [];

$(document).on("click", "#account .tabs li", function() {
	var tab = $(this).data('tab');

	if(tab > 1) {
		$("#tab_" + tab).html("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");
		if(tab === 2) {
			window.vgoapp.currentPage.transactions();
		} else if(tab === 3) {
			window.vgoapp.currentPage.bets();
		} else if(tab === 4) {
			window.vgoapp.currentPage.deposit();
		} else if(tab === 5) {
			window.vgoapp.currentPage.pending();
		}
	}

	$("#account .tabs li").removeClass('is-active');
	$(this).addClass('is-active');

	$("#account .tab-content-account div").removeClass('is-active');
	$("#account .tab-content-account div[data-content='" + tab + "']").addClass('is-active');
});

$(document).on("click", "#tradelink_save", function() {
	var tradelink = $("#tradelink").val();
	$.ajax({
		"url": "/api/User/UpdateTradeLink",
		"method": "POST",
		"data": {
			tradelink: tradelink
		},
		"success": function(res) {
			var obj = (res);
            var back = obj.response.tradelink;
            if(obj.status === 1) {
            	$("#tradelink").val(back);
            } else {
            	$("#tradelink").val(back);
	            console.log("Status:", obj.status, obj.message);
	        }
	    }, "error": function() {
	        console.log("Error");
	        $(tab).html("Error");
	    }
	});
});

$(document).on("change", "input[name='items[]']", function() {
	items = $("input[name='items[]']:checked").map(function() {
		return $(this).val();
	}).toArray();

	if(items.length > 0) {
		$("button#do_deposit").prop('disabled', false);
	} else {
		$("button#do_deposit").prop('disabled', true);
	}
});

$(document).on("click", "#do_deposit", function() {
	if(items.length > 0) {
		$.ajax({
			"url": "/api/Trade/ItemDeposit",
			"method": "POST",
			"data": {
				items: items.join(",")
			},
			"success": function(res) {
				var obj = (res);
				if(obj.status === 1 && obj.response.offerid > 0) {
	                var offerid = obj.response.offerid;
					var out = "";
	                out += '<div style="text-align:center;">\n';
	                out += '<strong>Trade offer sent.</strong><br>\n';
	                out += '<br>\n';
	                out += '<a href="https://trade.onetruestage.com/trade-offers/' + offerid + '">click here to view and accept the offer</a>\n';
	                out += '</div>\n';
					$("#tab_4").html(out);
	            } else {
					console.log("Status:", obj.status, obj.message);
				}
		    }, "error": function() {
		        console.log("Error");
		        $(tab).html("Error");
		    }
		});
	}
});

$(document).on("click", "button.do_resend", function() {
	$(this).prop('disabled', true).html("<div class='fa fa-spin fa-spinner'></div>");
	var itemid = $(this).data("itemid");

	if(itemid > 0) {
		$.ajax({
			"url": "/api/Trade/ItemWithdraw",
			"method": "POST",
			"data": {
				items: itemid
			},
			"success": function(res) {
				var obj = (res);
				if(obj.status === 1) {
					var offerid = obj.response.offerid;
					$("#item_" + itemid + " p.offer").html('<a href="https://trade.onetruestage.com/trade-offers/' + offerid + '" class="button is-small is-primary">View Trade Offer</a>');
	            } else {
					console.log("Status:", obj.status, obj.message);
				}
	        }, "error": function(res) {
				var obj = (res);
				$("#item_" + itemid + " button.do_resend").prop('disabled', false).html("Resend Trade Offer");
		        console.log("Status:", obj.status, obj.message);
	            console.log("Error");
	        }
		});
	}
});