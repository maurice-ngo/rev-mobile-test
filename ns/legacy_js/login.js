				 
	
	   function createAccountLogin() {
		   
		  
    		var a = new Array("createEmail", "createPassword", "createVerify");
    	
    		var params = buildParams(a)+
    			'&women='+document.getElementById('women').checked+
    			'&men='+document.getElementById('men').checked+
    			'&both='+document.getElementById('both').checked+
    			'';
    		
    	
   
   	$.ajax({
   				   type: "POST",
				   url: 'CreateAccountAjax.jsp',
				   data: params,
				   dataType: 'jsonp',
				
				   success: function(msg){
				
								   doneCreateAccountLogin(msg);
				   }
				   
			});	
    	}
    function doneCreateAccountLogin(json) {
    	
    	
    	if (true) {
			var result = json.result;
		
			if (result=='success') {
		
					window.location.reload();
			} else {
			
				getErrorMessage(result);
			}
		}
    }  
    
    
    

	
	
    setInterval(function(){ document.getElementById('errorDiv').style.display='none';}, 10000);
	
	
		
	function login() {
    	
    	
		var userEmailTemp = document.getElementById('loginEmail').value;
		
		userEmailTemp = userEmailTemp.replace(/\u200B/gi, "");
		var userEmail = escape(userEmailTemp);
		var password = escape(document.getElementById('loginPassword').value);
		
		
		
		var params = "userEmail="+userEmail+"&password="+password;

		
		$.ajax({  
				  type: "POST",  
				  url: "LoginAjax.jsp?"+params,  
				  dataType: 'jsonp',
				  success: function(msg) {  
				   
				   		
				   		doLoginResponse(msg);
				   
				  }
				 
			     
				});
	
	}
    function doLoginResponse(json) {
		
		var msg = json.result;
		if (msg=='success') {
		
			  	window.location.reload();
			
		} else {
			getErrorMessage(msg);// errorDivs
    	}
	}
	
	
	 function getErrorMessage(msg){
    	//alert(msg);
    	document.getElementById('errorMsg').innerHTML = msg;
    	document.getElementById('errorDiv').style.display="block";
    }
    
	 function closeWindow(){
	 
	 
    //	document.getElementById("close").setAttribute("href", "#"+id);
    	document.getElementById('errorDiv').style.display='none';
    	//document.getElementById("close").setAttribute("href", "javascript:closeWindow();");
    }
	
	 function showForgotPassword(){
	 
	 
    	$("#login").css("display", "none");
    	$("#signuprevolve").css("display", "none");
    	$("#forgotPassword").css("display", "block");
    	
    }
	
	
	
	 function emailPassword(){
	 
	 	
    	var email = document.getElementById('emailField').value;
    	var params = "email="+email;
    	$.ajax({
			   url:"EmailPasswordAjax.jsp",
			   data: params,
			   success: function(msg){
			   
				   passwordResponse(msg);
			   }
		});
    }
    function passwordResponse(json){
    	if(json.trim()=='success'){
    	
    		window.location.reload();
    	}else{
    		getErrorMessage(json);
    	}
    }    
	