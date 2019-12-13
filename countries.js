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
    card.className = 'card';
    document.getElementsByClassName('container')[0].appendChild(card);

    let cardHead = document.createElement('div');
    cardHead.className = 'card-head';
    card.appendChild(cardHead);
    addCardHeadElements(card, cardHead, obj);

    if (document.getElementById('show-wiki').checked) {
        let wikiArticles = document.createElement('div');
        wikiArticles.className = 'wiki-articles';
        card.appendChild(wikiArticles);


        let selected = document.getElementById('country-choices');
        selected = selected.options[selected.selectedIndex].value;
        selected = selected.toLowerCase();
        selected = selected.split(' ').join('%20');


        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            method: 'GET',
            data: {
                origin: '*',
                action: 'query',
                format: 'json',
                list: 'search',
                prop: 'links',
                srsearch: selected + ',sports',
            },
            success: function (obj) {
                addWikiElements(card, wikiArticles, obj);
            }
        });
    }
}

function addWikiElements(card, wikiArticles, obj) {
    let head = document.createElement('h1');
    head.appendChild(document.createTextNode('Wikipedia Articles'));
    wikiArticles.appendChild(head);

    obj.query.search.forEach(res => {
        let container = document.createElement('div');
        container.className = 'wiki-info';
        wikiArticles.appendChild(container);

        $(`<h2><a href="http://en.wikipedia.org/?curid=${res.pageid}">${res.title}</a></h2>`).appendTo(container);
        $(`<p>${res.snippet}...</p>`).appendTo($(container));
    });

    if (!document.getElementById('show-wiki').checked) {
        wikiArticles.style.visibility = 'hidden';
    }
}

function addCardHeadElements(card, cardHead, obj) {
    let name = document.createElement('h1');
    name.appendChild(document.createTextNode(obj['name']));
    cardHead.appendChild(name);

    let del = document.createElement('div');
    del.className = 'delete-btn';
    del.appendChild(document.createTextNode('x'));
    del.addEventListener('click', deleteCard);
    cardHead.appendChild(del);

    let flag = document.createElement('img');
    flag.src = obj['flag'];
    cardHead.appendChild(flag);

    let infoTable = document.createElement('table');
    populateTable(infoTable, 'Population', 'population', obj);
    populateTable(infoTable, 'Native Name', 'nativeName', obj);
    populateTable(infoTable, 'Country Code', 'alpha3Code', obj);
    populateTable(infoTable, 'Calling Codes', 'callingCodes', obj);
    populateTable(infoTable, 'Region', 'region', obj);
    populateTable(infoTable, 'Sub-Region', 'subregion', obj);
    populateTable(infoTable, 'Capital', 'capital', obj);

    cardHead.appendChild(infoTable);

}

function deleteCard(evt) {
    let card = evt.target.parentNode.parentNode;
    card.parentNode.removeChild(card);
}

function populateTable(infoTable, attrName, attr, obj) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    let td = document.createElement('td');
    tr.appendChild(th);
    th.appendChild(document.createTextNode(attrName));
    if (attrName === 'Population') {
        td.appendChild(document.createTextNode(obj[attr].toLocaleString()))
    } else {
        td.appendChild(document.createTextNode(obj[attr]));
    }
    tr.appendChild(td);
    infoTable.appendChild(tr);
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

function toggleWiki(evt) {
    let cardList = document.getElementsByClassName('card');

    for (obj in cardList) {
        if (evt.target.checked) {
            let selected = cardList[obj].firstChild.firstChild.firstChild.data;
            selected = selected.split(' ').join('%20');

            let wikiArticles = document.createElement('div');
            wikiArticles.className = 'wiki-articles';
            cardList[obj].appendChild(wikiArticles);

            $.ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                method: 'GET',
                data: {
                    origin: '*',
                    action: 'query',
                    format: 'json',
                    list: 'search',
                    prop: 'links',
                    srsearch: selected + ',sports',
                },
                success: function (obj) {
                    addWikiElements(cardList[obj], wikiArticles, obj);
                }
            });
        } else {
            cardList[obj].removeChild(cardList[obj].lastChild);
        }
        //     }
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

    let checkbox = document.getElementById('show-wiki');
    checkbox.addEventListener('click', toggleWiki);
}

