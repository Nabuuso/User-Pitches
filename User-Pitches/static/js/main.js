$(document).ready(function(){
    //GET PITCH CATEGORY
    getSubCategory();
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
            // getSubCategory()
            location.reload()
        });
    });
    //GET SUBCATEGORY
    function getSubCategory(){
        $.ajax({
            url:'pitch-categories',
            method:'GET',
            cache:false,
            success:function(data){
                for(let i=0; i < data.length;i++){
                    let tbl = "<tr>";
                    tbl += "<td>"+data[i].name+"</td>"
                    tbl += "<td>"+data[i].created_date+"</td>"
                    tbl += "</tr>"
                    $("#table-category").append(tbl)

                    $("#categories-list").append("<a href='#' class='list-group-item list-group-item-action'>"+data[i].name+"</a>")
                    $("#category-combobox").append("<option value="+data[i].id+">"+data[i].name+"</option>")
                }
               

            }
        })
    }
    //SAVE PITCH
    $("#submit-pitch-btn").click(function(e){
        alert("Hello")
        e.preventDefault();
        $.ajax({
            data:{
                title : $('#title').val(),
                description:$('#pitch-description').val(),
                category:$('#category-combobox').val(),
                user:6
            },
            type:'POST',
            url:'pitch-content',
            success:function(){
                alert("Pitch created successfully!")
                $('#title').val('')
                $('#pitch-description').val(''),
                $('#category-combobox').val('')
                location.reload()
            }
        })
    })
    //LOAD PITCH CATEGORIES
    // $("#category-link").click(function(e){
    //     e.preventDefault();
    //     $("#dashboard-container").load("categories")
    // })
})