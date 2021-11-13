$(document).ready(function(){
    //GET PITCH CATEGORY
    getSubCategory();
    //GET PITCHES
    getAllPitches();
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
    //GET PITCHES
    function getAllPitches(){
        $.ajax({
            url:'pitch-content',
            method:'GET',
            cache:false,
            success:function(data){
                if(data.length > 0){
                    for(let i=0; i < data.length;i++){
                        let card = "<div class='card'>"
                        card += " <div class='card-body'>"
                        card += "<h3>"+data[i].title+"</h3>"
                        card += "<blockquote>"+data[i].description+"</blockquote>"
                        card += "<div id='comment-display-section'></div>"
                        card += "<hr>"
                        // Add comments
                        card += "<div class='pitch-footer'>"
                            card += "<div>"
                            card += "<i class='far fa-comment pitch-info-icon'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                            //READ COMMENTS
                            card += "<i class='fab fa-readme pitch-info-icon'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                            //UPVOTE
                            card += "<i class='far fa-thumbs-up pitch-info-icon upvote-btn' style='color:#0000FF' data-id='"+data[i].id+"'><span class='pitch-info-icon'  >"+data[i].upvote+"</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                            //DOWNVOTE
                            card += "<i class='far fa-thumbs-down pitch-info-icon' style='color:#FF0000'><span class='pitch-info-icon'>"+data[i].downvote+"</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                            card += "</div>"
                            //CLOSE TAGS
                            card += "<div>"
                            card += "<small>Posted on:"+new Date(data[i].created_date)+"</small>"
                            card +="</div>"
                        card +="</div>"
                        card += "<hr>"
                        card +="</div>"
                        card +="</div><br/>"
                        $("#pitch-content-section").append(card)
                    }
                }else{
                    let dv = "<div class='no-content'>"
                    dv += "<p><i>No data found</i></p>"
                    dv += "</div>"
                    $("#pitch-content-section").append(dv)
                }
               
               

            }
        })
    }
    //UPVOTE
   $(document).on('click','.upvote-btn',function(){
       let id = $(this).data("id");
       $.ajax({
        data:{},
        type:'POST',
        url:'upvote/'+id,
        success:function(data){
            // alert(data.upvote)
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