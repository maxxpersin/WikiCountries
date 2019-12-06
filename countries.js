function addDropDown(obj) {
    if (obj.length === 0) {
        alert('No Countries');
        return;
    }
    let container = document.getElementById('search');

    if (document.getElementById('country-choices')) {
        container.removeChild(document.getElementById('country-choices'));
    }

    let dropDown = document.createElement("select");
    dropDown.id = 'country-choices';
    container.appendChild(dropDown);

    obj.forEach(country => {
        let item = document.createElement('option');
        item.value = country.name;
        let text = document.createTextNode(country.name);
        item.appendChild(text);
        dropDown.appendChild(item);
    });

    let addCountryBtn = document.createElement('div');
    addCountryBtn.id = 'save';
    addCountryBtn.appendChild(document.createTextNode('Save'));
    addCountryBtn.className = 'btn';
    container.appendChild(addCountryBtn);
}

function search(evt) {
    let query = document.getElementById('input').value;
    if (query.length === 2) {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/name/' + query,
            method: 'GET',
            data: {
                // alpha2code: query,
                fields: 'name;alpha2code'
            },
            success: function (obj) {
                console.log(obj);
                addDropDown(obj);
            },
            error: noCountriesAlert
        });
    } else {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/name/' + query,
            method: 'GET',
            data: {
                //alpha3code: query.substring(0, 3),
                fields: 'name;alpha3code'
            },
            success: function (obj) {
                console.log(obj);
                addDropDown(obj);
            },
            error: noCountriesAlert
        });
    }

}

function noCountriesAlert() {
    let container = document.getElementById('search');

    if (document.getElementById('country-choices')) {
        container.removeChild(document.getElementById('country-choices'));
    }

    if (document.getElementById('save')) {
        container.removeChild(document.getElementById('save'));
    }

    alert('No Countries');
}

var setEvents = function () {
    let submit = document.getElementById('search-btn')
    console.log(submit);
    submit.addEventListener('click', search);
    //submit.onclick = search(evt);
}

