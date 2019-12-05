'use strict'
//--------------------------------------- message block
let messageBlock;

function showMessage() {
    let elem = document.createElement('div');
    elem.className = 'message'
    document.body.appendChild(elem);
    elem.style.left = 50 + '%';
    elem.style.top = 50 + '%';

    let elemOK = document.createElement('div');
    elemOK.className = 'ok-btn';
    elemOK.innerHTML = 'OK';
    document.body.lastChild.appendChild(elemOK);
    elemOK.style.left = 50 + '%';
    elemOK.style.top = 50 + '%';

    messageBlock = elem;
    return true;
}

function hideMessage(messageBlock) {
    if (messageBlock) {
        document.body.removeChild(messageBlock);
        messageBlock = null;
    }
}
//----------------------------------------- validation

function showError(inputElem) {
    if (typeof (inputElem) == 'object') inputElem.classList.add('error');
}

function resetError(inputElem) {
    if (typeof (inputElem) == 'object') inputElem.classList.remove('error');
}

function checkValidInput(inputElem, mask, required) {
    if (inputElem.value.match(mask) != null || (!required && !inputElem.value)) {
        inputElem.isValid = true;
    } else {
        inputElem.isValid = false;
        showError(inputElem);
    }
}


function validate(form) {
    let elems = form.elements;

    for (let key in elems) {
        resetError(elems[key]);
    }

    checkValidInput(elems.name, /^[а-яА-ЯёЁa-zA-Z]+$/, true);
    checkValidInput(elems.surname, /^[а-яА-ЯёЁa-zA-Z]+$/, true);
    checkValidInput(elems.tel, /^[0-9()\-+ ]+$/, true);
    checkValidInput(elems.email, /[a-zA-Z0-9_]+@[a-zA-Z0-9_]/, false);
    // /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/

    for (let key in elems) {
        if (typeof (elems[key]) == 'object') {
            if (elems[key].isValid == false) return false;
        }
    }
    return true;
}
//-------------------------------------- promise

function request() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(showMessage());
        }, 2000);
    });
}

//------------------------------------- common
let form = document.forms.registration;
let btnSubmit = document.getElementsByName('submit');


//--------------------------------------- events

form.onclick = function (e) {
    let target = e.target;

    if (target.name != 'submit') {
        resetError(target);
    }

    if (target.name == 'submit') {
        form.onsubmit = function () {
            if (!validate(form)) return false;
            request()
                .then(
                    response => {
                        btnSubmit[0].disabled = true;
                        btnSubmit[0].classList.remove('btn');
                        btnSubmit[0].classList.add('btn-disabled');
                    },
                    error => {}
                );
            return false;
        }
    }
}

document.body.onclick = function (e) {
    let target = e.target;

    if (target.classList.contains('ok-btn')) {
        hideMessage(messageBlock);
    }
}