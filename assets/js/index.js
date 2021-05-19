const PORT = 3000 || 8080

$("#add_user").submit(function (event) {
    alert("Korisnik uspješno dodan!");
})

$("#add_class").submit(function (event) {
    alert("Razred uspješno dodan!");
})

$("#update_user").submit(function (event) {
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {};

    $.map(unindexed_array, function (n, i) {
        data[n['name']] = n['value']
    })

    //console.log(unindexed_array);



    var request = {
        "url": `/api/users/${data._id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function (response) {
        alert("Korisnik uspješno ažuriran");
    })

})

if (window.location.pathname == "/") {
    document.getElementById("logout").style.display = "none";
}
else {
    document.getElementById("logout").style.display = "block";
}

if (window.location.pathname == "/myUsers") {
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function () {
        var id = $(this).attr("data-id")

        var request = {
            "url": `/api/users/${id}`,
            "method": "DELETE"
        }

        if (confirm("Zelite li izbrisati ovog korisnika?")) {
            $.ajax(request).done(function (response) {
                alert("Korisnik uspješno izbrisan!");
                location.reload();
            })
        }

    })
}
else if (window.location.pathname == "/myClasses") {
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function () {
        var id = $(this).attr("data-id")

        var request = {
            "url": `/api/classes/${id}`,
            "method": "DELETE"
        }

        if (confirm("Zelite li izbrisati ovaj razred?")) {
            $.ajax(request).done(function (response) {
                alert("Razred uspješno izbrisan!");
                location.reload();
            })
        }
    })
}

function checkIfClassNeeded(value) {
    console.log("RADO");

    if (value != "Ucenik") {
        document.getElementById("divClass").style.display = "none";
    }
    else {
        document.getElementById("divClass").style.display = "block";
    }

}

function writeClassNameOnLabel(value) {
    document.getElementById("labelClassName").value = value
}

function setClassNameWhileUpdating(value) {
    document.getElementById("labelClassName").value = value
}

function changeLinkHref(value) {
    var filter = value;
    $('#selectAnswer option').each(function () {        
      //  console.log($(this).attr("data-classid"));
        if($(this).attr("data-classid")==value){
            $(this).show();
        }
        else{
            $(this).hide();
        }        
    })
}