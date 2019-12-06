function addDropDown(obj) {

}

function search(evt) {
    let query = document.getElementById('input').value;
    //if (query)
    $.ajax({
        url: 'https://restcountries.eu/rest/v2/alpha',
        method: 'GET',
        data: {alpha3code: query},
        success: function(obj) {
            console.log(obj);
            //addDropDown(obj);
        }
    });
}

var setEvents = function () {
    let submit = document.getElementById('search-btn')
    console.log(submit);
    submit.addEventListener('click', search);
    //submit.onclick = search(evt);
}

