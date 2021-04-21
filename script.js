(function(){
    const UrlPost = 'http://vocabulary.std-937.ist.mospolytech.ru/vocabularyPost.php';
    const UrlGet = 'http://vocabulary.std-937.ist.mospolytech.ru/vocabularyGet.php';


    // Активация формы на фокус
    let wordInput = document.querySelector('.wordInput');
    let headerBottom = document.querySelector('.header__bottom');
    let onWordInputFocus = function () {
        headerBottom.classList.add('focused');
    };
    wordInput.addEventListener('focus', onWordInputFocus);

    
    
    
    
    
    // Функция добавления обработчика
    let addHandlerToListItem = function (item, height) {
        item.addEventListener('click', function (){
            if (document.querySelector('.vocabulary__item-active') && item !== (document.querySelector('.vocabulary__item-active'))) {
                document.querySelector('.vocabulary__item-active').querySelector('.translate').style.height = '0px';
                document.querySelector('.vocabulary__item-active').classList.remove('vocabulary__item-active');
            }
            item.classList.toggle('vocabulary__item-active');
            if (item.classList.contains('vocabulary__item-active')) {
                item.querySelector('.translate').style.height = `${height - 15}px`;
            }
            else{
                item.querySelector('.translate').style.height = '0px';
            }
        });
    }
    let vocabularyItem = document.querySelectorAll('.vocabulary__item');
    vocabularyItem.forEach(item => {
        addHandlerToListItem(item);
    });

    
    // Получение всех слов из бд
    let list = document.querySelector('.vocabulary');
    let addInnerToLi = function (li, word, translate) {
        li.innerHTML = `<h2 class="h2 word"><span class="word__text">${word}</span><svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.72825 1C11.1614 8.15878 2.29457 3.63745 5.87346 14" stroke="#6743FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 10.7827C8.95222 12.6853 5.11031 19.6613 1 10" stroke="#6743FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></h2><h2 class="h2 translate"><svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5.05209C3.23612 2.20496 8.1587 -1.96079 9.96016 4.15346C11.7617 10.2677 16.0707 5.12628 18 1.79126" stroke="#6743FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="translate__text">${translate}</span></h2>`;   
    }
    let getWords = function (url) {
        return fetch(url).then(response => {
            return response.json();
        });
    }
    getWords(UrlGet).then(data => {
        let vocabulary = data;
        list.innerHTML = '';
        vocabulary.forEach(item => {
            let li = document.createElement('li');
            addInnerToLi(li, item['word'], item['translate']);
            list.appendChild(li);
            addHandlerToListItem(li, li.getBoundingClientRect().height);
            li.classList.add('vocabulary__item');
            li.querySelector('.translate').style.height = '0px';
        });
    }).catch(err => console.log(err));
    
    
    // Добавление нового слова
    let invalidWord = false;
    let invalidTranslate = false;
    let translateInput = document.querySelector('.translateInput');
    let onTranslateInput = function(evt) {
        if (invalidWord) {
            if (!translateInput.value) {
                translateInput.classList.add('invalid');
            }
            else{
                translateInput.classList.remove('invalid');
            }
        }
    }
    translateInput.addEventListener('input', onTranslateInput);
    let onWordInput = function () {
        if (invalidTranslate) {
            if (!wordInput.value) {
                wordInput.classList.add('invalid');
            }
            else{
                wordInput.classList.remove('invalid');
            }
        }
    }
    wordInput.addEventListener('input', onWordInput);

    // Функция отправки данных
    let sendRequest = function(url, body) {
        return fetch(url, {
            method: 'POST',
            body: body,
            header: {
                'Content-Type' : 'application/json',
            }
        }).then(response => {
            if (response.ok) {
                console.log('Ok');
            }
        });
    }

    
    let submitButton = document.querySelector('.button');
    let onSubmitButton = function (evt) {
        evt.preventDefault();
        let translate = translateInput.value.trim();
        let word = wordInput.value.trim();
        if (translate && word) {
            let formData = new FormData(document.querySelector('form'));
            sendRequest(UrlPost, formData).then(data => {
                getWords(UrlGet).then(data => {
                    let vocabulary = data;
                    list.innerHTML = '';
                    vocabulary.forEach(item => {
                        let li = document.createElement('li');
                        addInnerToLi(li, item['word'], item['translate']);
                        list.appendChild(li);
                        addHandlerToListItem(li, li.getBoundingClientRect().height);
                        li.classList.add('vocabulary__item');
                        li.querySelector('.translate').style.height = '0px';
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
            translateInput.value = '';
            wordInput.value = '';
            headerBottom.classList.remove('focused');
        }
        else{
            if (!translate) {
                invalidWord = true;
                translateInput.classList.add('invalid');
            }
            if (!word) {
                invalidTranslate = true;
                wordInput.classList.add('invalid');
            }
        }
    };
    submitButton.addEventListener('click', onSubmitButton);
})();