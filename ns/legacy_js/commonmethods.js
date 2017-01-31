/**
 * 
 */
function showRevolve(){

	$('#logo_drop_down_mhp a.up_mhp').toggleClass('up_mhp down_mhp');
    $('#slide_menu_mhp').slideToggle("fast");
		
}



function logout()
{
    $.ajax({
        type: 'POST',
        url: '/r/ajax/SignOut.jsp?mobile=true',
        success: function(data){
            var obj = JSON ? JSON.parse(data) : $.parse(data);
            if (obj.success){
				window.location.reload();
            }
        }
    });
}


//heart functions

function heartProductM(elem, pcode,size,view, sectionUrl){
	if($(elem).find("span").hasClass("hearted_active")){
		$(elem).find("span").removeClass("hearted_active");
		submitHeart("product", pcode, "remove", undefined, sectionUrl);
	}else{
		$(elem).find("span").addClass("hearted_active");
		submitHeart("product", pcode, "add", undefined, sectionUrl);
	}
	return false;
}

//this method only use in mobile display product page
function heartAll(elem){
	if($(elem).find("span").hasClass("hearted_active")){
		$(".fav_heart").addClass("hearted_active");
	}else{
		$(".fav_heart").removeClass("hearted_active");
	}
}
function submitHeart(paramtype, paramvalue){
	if(typeof paramtype ==="undefined" || typeof paramvalue ==="undefined" ) return;
	if(typeof arguments[2] ==="undefined" ) return;
	var psize = "";
	// optional argument
	if(typeof arguments[3] !=="undefined" ) {
		psize = arguments[3];
	}
    var sectionUrl = "";
    if(typeof arguments[4] !=="undefined" ) {
        sectionUrl = arguments[4];
    }

	if (window.XMLHttpRequest){
		// for IE7+, FF, Chrome, Opera, Safari
		xhttp2 = new XMLHttpRequest();
	}
	else{
		// for IE6 and older
		xhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
	}
	var URL = "/r/ajaxHeartProduct.jsp?";
	var dataToSend="";
	if(paramtype === "product")	{
		dataToSend += "&pcode="+encodeURIComponent(paramvalue);
	}else if(paramtype === "brand")	{
		dataToSend += "&bcode="+encodeURIComponent(paramvalue);
	}
	dataToSend += "&action_T="+encodeURIComponent(arguments[2]);
	if(psize !=="")	dataToSend += "&psize="+encodeURIComponent(psize);
    if(sectionUrl !=="")	dataToSend += "&sectionURL="+encodeURIComponent(sectionUrl);

	xhttp2.open("POST", URL, false); // async
	xhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded"); // this is needed
	xhttp2.send(dataToSend);
	var res = xhttp2.responseText;

	res = res.replace(/^\s+|\s+$/g,"");
	updateHeartCount();

}

function updateHeartCount(){
    $.ajax({
        type: "POST",
        url: "/r/AjaxHeartTotalCount.jsp",
        cache:false,
        success: function(response) {
            var responseObj = eval('(' + response + ')');
            $("#heart_total_count").html(responseObj);
        }
    });

}

function toggle_visibility(id) {
 	$("#"+id).slideToggle("fast");
}

//scoll to top button
function scrollToTop(){
	$('body,html').animate({
		scrollTop: 0
	}, 'fast');
	return false;
}
//typo...
function scollToTop(){
	$('body,html').animate({
		scrollTop: 0
	}, 'fast');
	return false;
}
//mobile email sign up
function emailSignUpM(event){
	$emailForm = $("#email_signup_form");
	$emailForm.find("input").removeClass("error");
	var email = $emailForm.find("input").val();	
	var gender = $emailForm.data("gender");
	if(email.indexOf("@") != -1){		
		$.get( "/r/ajax/SignUpForNewsletter.jsp", {"email" : email, "gender": gender}, function( r ) {
			var msg =  $.parseJSON(r);
			$emailForm = $("#email_signup_form");
			if(msg.success){
				//success
				$emailForm.find("span").eq(0).show();
				$emailForm.find("input").hide();
				$emailForm.find("span").eq(1).hide();
				window.open("/r/mobile/email/subscribe_landing_m.jsp?email="+email+"&homePage=true");
			}else{
				$emailInput = $emailForm.find("input");
				$emailInput.val("");
				$emailInput.attr("placeholder",msg.msg0);
				$emailInput.addClass("error");
			}
		});
	}else{
		//show error message
		$emailInput = $emailForm.find("input");
		$emailInput.val("");
		$emailInput.attr("placeholder","Invalid email. Please try again");
		$emailInput.addClass("error");
	}	
	event.preventDefault();
}

function showReviewPopup(event){
	//set product name, brand and image url for popup
	var imgUrl = $("div.rsSlide").find("img").attr("src");
	$productInfo = $("div.product_detail_info");
	var brandName = $productInfo.find("h1").text();
	var productName = $productInfo.find("p").text();
	
	$popHeader = $("div.pdp_pop_header");
	$popHeader.find("h2").text(productName);
	$popHeader.find("p").text(brandName);
	$("div.product_wrap").find("img").eq(0).attr("src",imgUrl);
	//end init popup
	$("#product_info_div").hide();
	$("#review_popup_div").show();
	scollToTop();
	event.preventDefault();
}

function closeReviewPopup(event){
	$("#review_popup_div").hide();
	$("#product_info_div").show();
	event.preventDefault();
}

function submitReview(event){
	$popupDiv = $("#review_popup_div");
	var star = $popupDiv.find("input[name='rating-1']:checked").val();
	var size = $popupDiv.find("div.size_recommend").find("div.checked input").val();
	var curve = $popupDiv.find("div.size_recommend2").find("div.checked input").val();
	var height = $popupDiv.find("div.size_recommend3").find("div.checked input").val();
	var reviewText = $popupDiv.find(".review_text_box").val();
	var rName = $popupDiv.find("#rName").val();
	var rEmail = $popupDiv.find("#rEmail").val();
	var rCityState = $popupDiv.find("#rCityState").val();
	var code = $("#product_code_hidden").val();
	var data = {
		"overallAddRevValueField":star,
		"sizingAddRevValueField" :size,
		"bodyTypeAddRevValueField" :curve,
		"heightTypeAddRevValueField" :height,
		"comments" :reviewText,
		"screenName" :rName,
		"emailAddRev" :rEmail,
		"cityState" :rCityState,
		"code" : code
	};
	
	$.post( "/ReviewProduct.jsp", data, function( r ) {
		$("#review_popup_div").hide();
		$("#thank_you_div").show();
		event.preventDefault();
	});
}

//popup
function closePopUp(){
	$(".cancel_remove_popup").fadeOut();
}
function showPopUp(msg){
	$popup = $(".cancel_remove_popup");
	$popup.fadeIn("fast");
	$popup.find("h1").html(msg);;

}

function closePopUpDisplay(event){
	$("#product_info_div").show();
	$("#thank_you_div").hide();
	event.preventDefault();
}

/*
 * disable a button, $btn is a jQuery $(input)object
 */
function disableSubmit($btn){
    $btn.prop("disabled",true);
    $btn.css("opacity","0.5");
    $btn.val("Please Wait...");
}