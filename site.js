var debug;
jQuery(function(){
    // filter bg transition
    var refresh_inteval = false;
    var filter_frame_ori_class = $("#filter").attr("class");
    function change_bg(){
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

            if($(document).scrollTop() > $("#menu-enabler").position().top + 280)
                $("#menuable").addClass("menued");
            else
                $("#menuable").removeClass("menued");
            
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
            alert("這個不是圖片吧！");
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
                    alert("喔不，圖片有問題或是傳送失敗！");
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
                        alert("喔不，發生錯誤: " + res.result);
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
                    $('#submit-confirm').modal({onApprove:confirm_send}).modal('show');
                }
            },
            error:function(xhr,e){
                debug = e;
                alert("喔不，發生錯誤: " + e);
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
                        result = "喔不，發生錯誤:" + res.result;
                    }
                }
                else{
                    result = "感謝您的參與！您可以再上傳更多相片！";
                    setTimeout(function(){
                        $('input#uploader').prop("value","");
                        $("input[name=des]").prop("value","");
                        $("input[name=img]").prop("value","");
                        $("input[name=g-recaptcha-response]").prop("value","");
                        $("#shown-has-img").slideUp();
                        grecaptcha.reset();
                    },900);
                }
                $("#result").text(result);
            },
            error:function(xhr,e){
                debug = e;
                $("#result").text("喔不，發生錯誤: " + e);
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
