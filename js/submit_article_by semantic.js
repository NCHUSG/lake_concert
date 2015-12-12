$(document).ready(function() {	
	$('.ui.selection.dropdown').dropdown();	    
	//當文件準備好的時候，讀入json檔	                
	$.getJSON("json/department.json",function(depJson){                   
	    window.department_name={};
	    $.each(depJson,function(ik,iv){
	        if(typeof(window.department_name[iv.degree])=='undefined'){
	            window.department_name[iv.degree]=[];
	        }
	        //console.log(iv.degree)
	        $.each(iv.department,function(jk,jv){
	            var option="";
	            option+=jv.value+'-'+jv.name;
	            window.department_name[iv.degree].push(option);
	        })
	    })	
	    $("#v_degree").change(function(){//會動態變動系所與年級名稱
	    	//if the career(degree) has been changed, also change the level
	    	var pre_sel_option = '<div class="item" data-value="請選擇系所">請選擇系所</div>';
	        $("#v_major .menu").empty().append(pre_sel_option);
	        var str = $(this).dropdown('get value');
	        $.each(window.department_name[str],function(ik,iv){
	            var newOption=$('<div class="item" data-value="'+window.department_name[str][ik]+'">'+window.department_name[str][ik]+'</div>');
	            $("#v_major .menu").append(newOption);	        
	            //append all the department option into major field!!
	        })  
	        pre_sel_option = '<div class="item" data-value="請選擇年級">請選擇年級</div>';
	        if(str=='碩士班'||str=='博士班'||str=='碩專班'||str=='產專班'){
	            $('#v_level .menu').empty().append(pre_sel_option);	        
	            var freshman_value="6",sophomore_value="7";
	            if(str=='博士班'){
	                freshman_value="8";
	                sophomore_value="9";
	            }
	            var newGrade=$('<div class="item" data-value='+freshman_value+'>一年級</div>');
	            var newGrade2=$('<div class="item" data-value='+sophomore_value+'>二年級</div>');
	            $('#v_level .menu').append(newGrade).append(newGrade2);	        
	        }
	        else{                        
	            $('#v_level .menu').empty().append(pre_sel_option);
	            var option_array=[
	            	'<div class="item" date-value="無年級">無年級</div>',
	            	'<div class="item" date-value="1">一年級</div>',
	            	'<div class="item" date-value="2">二年級</div>',
	            	'<div class="item" date-value="3">三年級</div>',
	            	'<div class="item" date-value="4">四年級</div>',
	            	'<div class="item" date-value="5">五年級</div>'
	            ]
	            option_array.forEach(function(option) {
	            	$('#v_level .menu').append(option);
	            })                 
	        }  
	        var default_value = $("#v_major .menu > .item:first-child").html();
	        $("#v_major").dropdown('refresh').dropdown('set value', default_value).dropdown('show');	                	      
	        $('.ui.selection.dropdown').dropdown();
	        $("#v_major").change(function(){
	        	var default_value = $("#v_level .menu > .item:first-child").html();	 
	        	$("#v_level").dropdown('refresh').dropdown('set value', default_value).dropdown('show');
	        })
	    })	
			
		// $("#v_major").change(function(){
		// 	var default_value_level = $("#v_level .menu > .item:first-child").html();
		// 	$("#v_level").dropdown('refresh').dropdown('set value', default_value_level).dropdown('show');
		// })
	    $('.ui.checkbox').checkbox();
	})  
	$('#submit').click(function(){
		var name = $('#name').val();
		var degree = $('#v_degree').dropdown('get value');
		var major = $('#v_major').dropdown('get value');
		var level = $('#v_level').dropdown('get value');
		var context = $('#text-submit').val();
		console.log(name)
		console.log(degree)
		console.log(major)
		console.log(level)
		console.log(context)
	})	            	                	
});
	
