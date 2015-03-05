var debug;
jQuery(function(){
    // filter bg transition
    var refresh_inteval = false;
    var filter_frame_ori_class = $("#filter").attr("class");
    function change_bg(){
        if($(document).scrollTop() > $("#menu-enabler").position().top + 280)
            $("#menuable").addClass("menued");
        else
            $("#menuable").removeClass("menued");

        if(!refresh_inteval){
            // console.log("change triggered!");
            if($(document).scrollTop() > $('#vender').position().top - $(window).height()/2)
                $("#filter").attr("class",filter_frame_ori_class + ' vender');
            else if($(document).scrollTop() > $('#concert').position().top - $(window).height()/2)
                $("#filter").attr("class",filter_frame_ori_class + ' concert');
            else if($(document).scrollTop() > $('#recruit').position().top - $(window).height()/2)
                $("#filter").attr("class",filter_frame_ori_class + ' recruit');
            else if($(document).scrollTop() > $('#des').position().top - $(window).height()/2)
                $("#filter").attr("class",filter_frame_ori_class + ' des');
            else
                $("#filter").attr("class",filter_frame_ori_class);

            refresh_inteval = true;
            setTimeout(function(){
                refresh_inteval = false;
            },75);
        }
    }
    $(window).scroll(change_bg);
    change_bg();

    // goto
    $("#index .goto").click(function(){
        $('body').scrollTo( $($(this).attr("href")), 800 );
    }).popup({
        position:'bottom center'
    });

	JT2html({
		body:'@{}',
		"":'<div class="column"><div id="confirm" class="ui inverted cus-orange raised segment"><a class="ui ribbon blue label">@{author}</a><img class="ui bordered centered image" src="@{img}"><div class="ui pointing centerized teal label">@{text}</div></div></div>'
	}).fromGS('https://spreadsheets.google.com/feeds/list/14OZEhnyAUUZgmV090p38_uTO-hEdAfn_WzSBT27t40A/1/public/values?alt=json',function(html){
		jQuery("#memories").empty().append(html);
	});

    function slide_show(hash){
        var target = jQuery(hash);
        if(target.length){
            jQuery(".performer_card.hidable").addClass('hidden');
            jQuery(hash).removeClass('hidden');
        }
        else{
            return false;
        }
    }

	jQuery.get('https://spreadsheets.google.com/feeds/list/14OZEhnyAUUZgmV090p38_uTO-hEdAfn_WzSBT27t40A/2/public/values?alt=json',function(data){
		var slides_ctl = JT2html({
			body:"@{}",
			"":'<div class="item"><img class="ui avatar image" src="@{img}"><div class="content"><a href="#@{nick}" class="header slide_ctl">@{text}</a></div></div>',
			des:"@{text}",
		}).fromGSJson(data.feed.entry);
		var slides = JT2html({
			body:"@{}",
			"":'<div id="@{nick}" class="ui fluid card performer_card hidable hidden"><div class="image"><img src="@{img}"></div><div class="content"><a class="header">@{text}</a><div class="description">@{des}</div></div></div>',
			des:"@{text}<br/>",
		}).fromGSJson(data.feed.entry);
		var container = jQuery("#performer_container");
		var ctl = jQuery("#performer_list");
		container.empty().append(slides);
		ctl.empty().append(slides_ctl);

		if(window.location.hash)
            slide_show(window.location.hash)
		else
			jQuery(".performer_card.hidable.hidden").eq(0).removeClass('hidden');
		jQuery(".slide_ctl").click(function(e){
            slide_show(jQuery(this).attr('href'));
		})
	});

	JT2html({
		body:'@{}',
		"":'<div class="ui list"><div class="item"><img class="ui avatar image" src="@{img}"><div class="content"><a class="header">@{name}</a><div class="description">@{des}</div></div></div></div>'
	}).fromGS('https://spreadsheets.google.com/feeds/list/14OZEhnyAUUZgmV090p38_uTO-hEdAfn_WzSBT27t40A/3/public/values?alt=json',function(html){
		jQuery("#vender_list").empty().append(html);
	});

	JT2html({
		body:'@{}',
		"":'<a target="_blank" href="@{href}" class="ui us image blue label"><img src="@{img}">@{name}<div class="detail">@{subname}</div></a>'
	}).fromGS('https://spreadsheets.google.com/feeds/list/14OZEhnyAUUZgmV090p38_uTO-hEdAfn_WzSBT27t40A/4/public/values?alt=json',function(html){
		jQuery("#sponsers").append(html);
	});

});
