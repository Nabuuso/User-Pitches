$(document).ready(function () {
    //GET PITCH CATEGORY
    getSubCategory();
    //GET PITCHES
    getAllPitches();
    getClientPitches();
    //Register user
    $("#registerBtn").click(function (e) {
        e.preventDefault();
        $.ajax({
            data: {
                full_name: $('#fullName').val(),
                email: $('#email').val(),
                password: $('#password').val()
            },
            type: 'POST',
            url: 'users'
        }).done(function (data) {
            alert("Registration completed successfully!")
            $('#fullName').val('')
            $('#email').val(''),
                $('#password').val('')
            location.reload()
        });
    });
    //SUBMIT CATEGORY
    $("#submitCategory").click(function (e) {
        let clId = $("#current-user-id").val()
        if (clId) {
            e.preventDefault();
            $.ajax({
                data: {
                    category_name: $('#category').val(),
                },
                type: 'POST',
                url: 'pitch-categories'
            }).done(function (data) {
                alert("Pitch created successfully");
                $('#category').val('')
                // getSubCategory()
                location.reload()
            });
        } else {
            alert("Login to sumit a category")
        }
    });
    //GET SUBCATEGORY
    function getSubCategory() {
        $.ajax({
            url: 'pitch-categories',
            method: 'GET',
            cache: false,
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    let tbl = "<tr>";
                    tbl += "<td>" + data[i].name + "</td>"
                    tbl += "<td>" + data[i].created_date + "</td>"
                    tbl += "</tr>"
                    $("#table-category").append(tbl)

                    $("#categories-list").append("<a href='#' class='list-group-item list-group-item-action pitch-category-item' data-id='" + data[i].id + "' data-name='" + data[i].name + "'>" + data[i].name + "</a>")
                    $("#category-combobox").append("<option value=" + data[i].id + ">" + data[i].name + "</option>")
                }


            }
        })
    }
    //POPULATE PITCHES SECTION
    function populatePitches(data, action) {
        $("#pitch-content-section").html("")
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let card = "<div class='card'>"
                card += " <div class='card-body'>"
                card += "<h3>" + data[i].title + "</h3>"
                card += "<blockquote>" + data[i].description + "</blockquote>"
                card += "<hr>"
                // Add comments
                card += "<div class='pitch-footer'>"
                card += "<div>"
                card += "<i class='far fa-comment pitch-info-icon comment-btn' data-id='" + data[i].id + "'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                //READ COMMENTS
                card += "<i class='fab fa-readme pitch-info-icon read-comments-btn' data-id='" + data[i].id + "'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                //UPVOTE
                card += "<i class='far fa-thumbs-up pitch-info-icon upvote-btn' style='color:#0000FF' data-id='" + data[i].id + "'><span class='pitch-info-icon'  >" + data[i].upvote + "</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                //DOWNVOTE
                card += "<i class='far fa-thumbs-down pitch-info-icon downvote-btn' style='color:#FF0000' data-id='" + data[i].id + "'><span class='pitch-info-icon'>" + data[i].downvote + "</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                card += "</div>"
                //CLOSE TAGS
                card += "<div>"
                card += "<small>Posted on:" + new Date(data[i].created_date) + "</small>"
                card += "</div>"
                card += "</div>"
                card += "<hr>"
                card += "<div id='comment-section-" + data[i].id + "'></div>"
                card += "</div>"
                card += "</div><br/>"
                $("#pitch-content-section").append(card)
            }
        } else {
            let dv = "<div class='no-content'>"
            dv += "<p><i>No data found</i></p>"
            dv += "</div>"
            $("#pitch-content-section").append(dv)
        }
    }
    //FILTER PITCH
    $(document).on('click', '.pitch-category-item', function () {
        let id = $(this).data("id")
        let name = $(this).data("name")
        $("#pitch-title").text(name)
        $.ajax({
            url: 'pitch-content/' + id,
            method: 'GET',
            cache: false,
            success: function (data) {
                populatePitches(data, 'filter')
            }
        })
    })
    //SAVE PITCH
    $("#submit-pitch-btn").click(function (e) {
        e.preventDefault();
        let clId = $("#current-user-id").val()
        if (clId) {
            $.ajax({
                data: {
                    title: $('#title').val(),
                    description: $('#pitch-description').val(),
                    category: $('#category-combobox').val(),
                    user: $("#current-user-id").val()
                },
                type: 'POST',
                url: 'pitch-content',
                success: function () {
                    alert("Pitch created successfully!")
                    $('#title').val('')
                    $('#pitch-description').val(''),
                        $('#category-combobox').val('')
                    location.reload()
                }
            })
        } else {
            alert("Please login to submit a pitch!")
        }


    })
    //GET PITCHES
    function getAllPitches() {
        $.ajax({
            url: 'pitch-content',
            method: 'GET',
            cache: false,
            success: function (data,) {
                populatePitches(data, 'all')
            }
        })
    }
    //UPVOTE
    $(document).on('click', '.upvote-btn', function () {
        let clId = $("#current-user-id").val()
        if (clId) {
            let id = $(this).data("id");
            $.ajax({
                data: {},
                type: 'POST',
                url: 'upvote/' + id,
                success: function (data) {
                    // alert(data.upvote)
                    location.reload()
                }
            })
        } else {
            alert("Please login to continue")
        }

    })
    $(document).on('click', '.downvote-btn', function () {
        let clId = $("#current-user-id").val()
        if (clId) {
            let id = $(this).data("id");
            $.ajax({
                data: {},
                type: 'POST',
                url: 'downvote/' + id,
                success: function (data) {
                    // alert(data.upvote)
                    location.reload()
                }
            })
        } else {
            alert("Please login to downvote!")
        }

    })
    $(document).on('click', '.comment-btn', function () {
        let clId = $("#current-user-id").val()
        if (clId) {
            let id = $(this).data("id");
            let dv = "<div>"
            dv += "<input type='hidden' id='id" + id + "' value='" + id + "'/>"
            dv += "<div class='mb-3'>"
            dv += "<label for='comment' class='form-label'>Comment</label>"
            dv += "<textarea class='form-control' id='comment" + id + "' rows='5'></textarea>"
            dv += "</div>"
            dv += "<button class='btn btn-primary submit-comment' id='submit-comment-" + id + "' data-id='" + id + "'>Submit comment</button>"
            dv += "</div>"
            $("#comment-section-" + id).html(dv)
        } else {
            alert("Login to comment")
        }

    })
    //SUBMIT COMMENT
    $(document).on('click', '.submit-comment', function (e) {
        e.preventDefault()
        let clId = $("#current-user-id").val()
        if (clId) {
            let id = $(this).data("id")
            $.ajax({
                data: {
                    description: $('#comment' + id).val(),
                    pitch: id,
                    user: $("#current-user-id").val()
                },
                type: 'POST',
                url: 'comments',
                success: function () {
                    alert("Comment created successfully!")
                    $('#comment' + id).val('')
                    location.reload()
                }
            })
        } else {
            alert("Please login to comment!")
        }

    })
    //READ COMMENTS
    $(document).on('click', '.read-comments-btn', function (e) {
        e.preventDefault()
        let clId = $("#current-user-id").val()
        if (clId) {
            let id = $(this).data("id")
            $.ajax({
                url: 'comments/' + id,
                method: 'GET',
                cache: false,
                success: function (data) {
                    for (let i = 0; i < data.length; i++) {
                        let dv = "<div class='user-comment-section'>"
                            dv += "<div class='comment-profile'>"
                                dv += "<i class='fas fa-user-tie user-icon></i>"
                            dv += "</div>"
                            dv += "<div class='user-comment'>"
                                dv += "<div><small><blockquote>" + data[i].description + "</blockquote></small></div>"
                                dv += "<div class='comment-user-section'>"
                                    dv += "<small>Posted by:<i>"+data[i].username+"</i></small>"
                                dv += "</div>"
                            dv += "</div>"
                        dv += "</div><br>"
                        $("#comment-section-" + id).append(dv)
                    }
                }
            })
        }else{
            alert("Please login to continue!")
        }

    })
    //GET CLIENT PITCHS
    function getClientPitches() {
        let clId = $("#current-user-id").val()
        $.ajax({
            url: 'client-pitch/' + clId,
            method: 'GET',
            cache: false,
            success: function (data) {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let card = "<div class='card'>"
                        card += " <div class='card-body'>"
                        card += "<h3>" + data[i].title + "</h3>"
                        card += "<blockquote>" + data[i].description + "</blockquote>"
                        card += "<hr>"
                        // Add comments
                        card += "<div class='pitch-footer'>"
                        card += "<div>"
                        card += "<i class='far fa-comment pitch-info-icon comment-btn' data-id='" + data[i].id + "'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                        //READ COMMENTS
                        card += "<i class='fab fa-readme pitch-info-icon read-comments-btn' data-id='" + data[i].id + "'></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                        //UPVOTE
                        card += "<i class='far fa-thumbs-up pitch-info-icon upvote-btn' style='color:#0000FF' data-id='" + data[i].id + "'><span class='pitch-info-icon'  >" + data[i].upvote + "</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                        //DOWNVOTE
                        card += "<i class='far fa-thumbs-down pitch-info-icon downvote-btn' style='color:#FF0000' data-id='" + data[i].id + "'><span class='pitch-info-icon'>" + data[i].downvote + "</span></i> &nbsp;&nbsp;&nbsp;&nbsp;"
                        card += "</div>"
                        //CLOSE TAGS
                        card += "<div>"
                        card += "<small>Posted on:" + new Date(data[i].created_date) + "</small>"
                        card += "</div>"
                        card += "</div>"
                        card += "<hr>"
                        card += "<div id='comment-section-" + data[i].id + "'></div>"
                        card += "</div>"
                        card += "</div><br/>"
                        $("#client-pitch-section").append(card)
                    }
                } else {
                    let dv = "<div class='no-content'>"
                    dv += "<p><i>No data found</i></p>"
                    dv += "</div>"
                    $("#client-pitch-section").append(dv)
                }
            }
        })
    }
    //DOWNVOTE

    //LOAD PITCH CATEGORIES
    // $("#category-link").click(function(e){
    //     e.preventDefault();
    //     $("#dashboard-container").load("categories")
    // })
})