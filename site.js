var debug;
jQuery(function(){
		var alert_message = {
			not_image: "您上傳的內容不是圖片，請修正",
			imgur_error: "圖片上傳出現問題，請稍後嘗試或更換圖片",
			post_error: "投稿內容受理失敗，錯誤內容如下\n",
			post_success: "投稿已受理，您仍可繼續投稿其他內容"
		};
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

    // uploader
    function upload(file) { // Copied from https://github.com/paulrouget/miniuploader
        if (!file || !file.type.match(/image.*/)){
            alert(alert_message.not_image);
            return;
        }
        $("#upload-dimer").addClass("active");
        var fd = new FormData();
        fd.append("image", file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.imgur.com/3/image.json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var link = JSON.parse(xhr.responseText).data.link;
                    $("#uploaded-href").attr("value",link);
                    $("#upload-dimer").removeClass("active");
                    $("#preview-btn").attr("href",link);
                    $("#shown-has-img").slideDown();
                    // $("#uploader-des").slideUp();
                } else {
                    alert(alert_message.imgur_error);
                }
            }
        };
        xhr.setRequestHeader('Authorization', 'Client-ID 4b9752a7616a955');
        // Get your own key http://api.imgur.com/
        xhr.send(fd);
    }
    
    window.ondragover = function(e) { e.preventDefault(); };
    window.ondrop = function(e) { e.preventDefault(); upload(e.dataTransfer.files[0]); };
    $("#uploader").change(function(){
        upload(this.files[0]);
    });

    function closeMyPopup(){
        $(this).popup('hide');
    }
    var submition;
    // submit
    $("#submit").click(function(){
        var form = $("#recruit-form");
        $('.popup').popup('hide');
        submition = form.serializeArray();
        $("#upload-dimer").addClass("active");
        $.ajax({
            url:form.attr('action'),
            dataType:'json',
            type:form.attr('method'),
            data:submition.concat([{name:"try",value:true}]),
            success:function(res){
                debug = res;
                if(res.result != "OK"){
                    if(res.error){
                        var err = res.error;
                        for(var k in err){
                            $("input[name="+k+"]").popup({
                                content:err[k],
                                on:'manual',
                            }).popup('show').click(closeMyPopup);
                        }
                    }else{
                        alert(alert_message.post_error + res.result);
                        debug = res;
                    }
                }
                else{
                    var confirm = {};
                    for(var k in submition){
                        confirm[submition[k].name] = submition[k].value;
                    }
                    $("#confirm-email").text(confirm.email);
                    $("#confirm-phone").text(confirm.phone);
                    $("#confirm-des").text(confirm.des);
                    $("#confirm-img").attr("src",confirm.img);
                    $("#confirm-name").text(confirm.name + " 同學");
                    $("#confirmed").addClass("disabled");
                    $("input[name=g-recaptcha-response]").prop("value","");
                    grecaptcha.reset();
                    $('#submit-confirm').modal({onApprove:confirm_send}).modal('show');
                }
            },
            error:function(xhr,e){
                debug = e;
                alert(alert_message.post_error + e);
            },
            complete:function(){
                $("#upload-dimer").removeClass("active");
            }
        });
    });

    function confirm_send(){
        var form = $("#confirm-form");
        $("#upload-dimer").addClass("active");
        $.ajax({
            url:form.attr('action'),
            dataType:'json',
            type:form.attr('method'),
            data:submition.concat(form.serializeArray()),
            success:function(res){
                console.log(res);
                debug = res;
                var result = "";
                if(res.result != "OK"){
                    if(res.error){
                        var err = res.error;
                        for(var k in err)
                            result += err[k] + " ";
                    }
                    else{
                        result = alert_message.post_error + res.result;
                    }
                    $("#complete-header").text("投搞失敗!");
                }
                else{
                    result = alert_message.post_success;
                    setTimeout(function(){
                        $('input#uploader').prop("value","");
                        $("input[name=des]").prop("value","");
                        $("input[name=img]").prop("value","");
                        $("#shown-has-img").slideUp();
                    },900);
                    $("#complete-header").text("投搞成功!");
                }


                $("#result").text(result);
            },
            error:function(xhr,e){
                debug = e;
                $("#result").text(alert_message.post_error + e);
                $("#complete-header").text("連線失敗!");
            },
            complete:function(){
                setTimeout(function(){
                    $('#complete').modal('show',{queue:true});
                    $("#upload-dimer").removeClass("active");
                    $(window).scroll(change_bg);
                },1000);
            }
        });
    }
});

function confirmed_OK(){
    $("#confirmed").removeClass("disabled");
}

