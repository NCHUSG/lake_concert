$(document).ready(function() {
	var authors_info = "https://script.google.com/macros/s/AKfycbzPgd-cmaREDvdKamPXdbjjZaco_3X4wPBjbi2pE88b7Yivtff_/exec";
	var sheet_obj1 = {SHEET_NAME: "sheet1"};
	// $.when($.get(authors_info, sheet_obj1))
	// 	.done(function(response1) {
	// 	console.log(response1);
		
	// });

	$('#submit').click(function(){
		if($('#checked').filter(":checked").length == 1){
		  $(this).attr('class','ui primary loading button');
		  var name_v = $('#name').val();
		  var phone_v = $('#phone').val();
		  var degree_v = $('#v_degree').dropdown('get value');
		  var major_v = $('#v_major').dropdown('get value');	
		  var level_v = $('#v_level').dropdown('get value');
		  var context_v = $('#text-submit').val();	
		  var photo_v = $('#photo').val();	 
		  var formData = {
			  name : name_v,
			  phone : phone_v,
			  degree : degree_v,
			  department : major_v,
			  level : level_v,
			  photo : photo_v,
			  article	 : context_v			
		  };	
		  $.post(authors_info, formData, function(response) {
			  var r = response;		
			  if(r["result"] == "success"){
				  $('#submit').attr('class','ui primary button');
				  $('#submit').text('Success');
				  toastr.success("已成功提交囉~~<br /><br />感謝您的參與", {timeOut: 250000});     
				  $('#name').val("");
				  $('#phone').val("");					
  				  $('#v_degree').children('div:eq(0)').text("");
	        	  $("#v_major").children('div:eq(0)').text("");
				  $('#v_level').children('div:eq(0)').text("");
				  $('#text-submit').val("");	
				  $('#photo').val("");			  
			  }
		  });
		}
		else{
			toastr.error("請同意條款喔~<br/>再提交喔~", {timeOut: 250000});     
		}
	})	   
});
/* 取得form單一輸入框的值, 第一個參數form是jquery selector */

function getFieldValue(myform, fieldName) {
  var text = myform.form('get value', fieldName);
  if (text != "") return text;
  else return "無";
}