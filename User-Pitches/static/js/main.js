$(document).ready(function(){
    //Register user
    $("#registerBtn").click(function(e){
        e.preventDefault();
        $.ajax({
            data:{
                full_name : $('#fullName').val(),
                email:$('#email').val(),
                password:$('#password').val()
            },
            type:'POST',
            url:'users'
        }).done(function(data){
            alert(data.name);
        });
    });
})