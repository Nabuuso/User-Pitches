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
            alert("Registration completed successfully!")
            $('#fullName').val('')
            $('#email').val(''),
            $('#password').val('')
            location.reload()
        });
    });
    //SUBMIT CATEGORY
    $("#submitCategory").click(function(e){
        e.preventDefault();
        $.ajax({
            data:{
                category_name : $('#category').val(),
            },
            type:'POST',
            url:'pitch-categories'
        }).done(function(data){
            alert("Pitch created successfully");
            $('#category').val('')
            location.reload()
        });
    });
})