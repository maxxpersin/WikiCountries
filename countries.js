function addDropDown(obj) {
    if (obj.length === 0) {
        alert('No Countries');
        return;
    }
    let container = document.getElementById('search');

    if (document.getElementById('country-choices')) {
        container.removeChild(document.getElementById('country-choices'));
        container.removeChild(document.getElementById('save'));
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

    addCountryBtn.addEventListener('click', saveCountry);
}

function addCountryCard(obj) {
    let card = document.createElement('div');
    document.getElementsByClassName('container')[0].appendChild(card);

    //TODO add styling and proper html structure to cards
    for (let key in obj) {
        let container = document.createElement('div');
        let text = document.createTextNode(key + ": " + obj[key]);
        container.appendChild(text);
        card.appendChild(container);
    }
}

function saveCountry(evt) {
    let selected = document.getElementById('country-choices');
    selected = selected.options[selected.selectedIndex].value;
    selected = selected.toLowerCase();
    selected = selected.split(' ').join('%20');
    
    $.ajax({
        url: 'https://restcountries.eu/rest/v2/name/' + selected + '?fullText=true',
        method: 'GET',
        success: function (obj) {
            addCountryCard(obj[0]);
        }
    });
}

function search(evt) {
    let query = document.getElementById('input').value;
    if (query.length === 2) {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/name/' + query,
            method: 'GET',
            data: {
                fields: 'name;alpha2code'
            },
            success: function (obj) {
                addDropDown(obj);
            },
            error: noCountriesAlert
        });
    } else {
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/name/' + query,
            method: 'GET',
            data: {
                fields: 'name;alpha3code'
            },
            success: function (obj) {
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

function setEvents() {
    let submit = document.getElementById('search-btn')
    submit.addEventListener('click', search);
}

