// Form validation

function validate() {
    
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    if(fname.length < 3){
        $('#validateName').html("Please Enter a Name");
        $('#validateName').css('color','red');
        
    }
    else{
        $('#validateName').css('display', 'none');
        
    }
    if(lname.length < 3){
        $('#validateName').css('display', 'block');
        $('#validateName').html("Please Enter a valid Name");
        $('#validateName').css('color','red');
        
    }
    else{
        $('#validateName').css('display', 'none');
        
    }
    let dob = $('#dob').val();
    let year = parseInt(dob.slice(0,4));   
    let age = 2022 - year;
    if(age< 16){
        $('#validateDOB').html("Minimum age required to sign up is 16");
        $('#validateDOB').css('color','red');
    }
    if(age > 16){
        $('#validateDOB').css('display','none');
    }
    
    // Username Validation -- using DB Connection


    //Password Validation
    let psw = document.getElementById('password').value;
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if(psw.length < 8){
        $('#validate').html("Password should have a minimum length of 8 letters");
    }    
    else if(!psw.match(numbers)){
        $('#validate').html("Password must contain at least 1 number");
    }
    else if(!psw.match(lowerCaseLetters)){
        $('#validate').html("Password must contain at least 1 lower case letter");
    }
    else if(!psw.match(upperCaseLetters)){
        $('#validate').html("Password must contain at least 1 upper case letter");    
    }

}

function isValid() {
    return false;
}