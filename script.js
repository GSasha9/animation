//определяем все анимированные элементы
const banner__text_small = document.querySelector('.banner__text-small');
const banner__text_big = document.querySelector('.banner__text-big');

const order1 = document.querySelector('.order1');
const order2 = document.querySelector('.order2');
const order3 = document.querySelector('.order3');
const order4 = document.querySelector('.order4');

// функция для сброса параметров элементов
function resetElements() {
    banner__text_small.style.top = '0px';
    banner__text_small.style.opacity = '0';
    banner__text_small.style.fontSize = 'initial';
    banner__text_big.style.left = '-950px';
    banner__text_big.style.opacity = '0';
    order1.style.transform = 'rotate(0deg)';
    order2.style.transform = 'rotate(0deg)';
    order3.style.transform = 'rotate(0deg)';
    order4.style.transform = 'rotate(0deg)';
}

//устанавливам флаг с путсым значением
let start = null;
//продолжительность анимации для элементов, выполняющих поворот
let duration = 250;

//функция для поворота элемента вправо
function rotate_element(timestamp, element, direction){
    if(!element.start){
        element.start = timestamp;
    }
    //вычисляем сколько времени прошло сначала анимации
    let progress = timestamp - element.start;
    //вычисляем угол поворта. 
    //используем Math.min, чтобы не выйти за максимально возможное значение
    //угла поворота
    let rotation = Math.min(progress / (duration / 45) * direction, 45);

    element.style.transform = `rotate(${rotation}deg)`;
    element.style.transition = 'ease-out 0.2s';
    if(Math.abs(rotation) < 45){
        //передаем функцию с параметрами в requestAnimationFrame
        window.requestAnimationFrame((newTimestamp) => rotate_element(newTimestamp, element, direction));
    }
    else{
        // задержка перед возвратом элементов к прежнему состоянию
        setTimeout(() => {
            window.requestAnimationFrame((newTimestamp) => rotate_back(newTimestamp, element, direction));
        }, 500);
        // сброс времени начала
        element.start = null; 
        }
    }

    
// функция для возврата элемента в исходное положение
function rotate_back(timestamp, element, direction) {
    if (!element.start) {
    element.start = timestamp;
    }
    let progress = timestamp - element.start;
    let rotation = Math.min(progress / (duration / 45) * direction, 45);
    element.style.transform = `rotate(${rotation}deg)`;
    element.style.transition = 'ease-out 0.4s';
    if ((direction === 1 && rotation > 0) || (direction === -1 && rotation < 0)){
        window.requestAnimationFrame((newTimestamp) => rotate_back(newTimestamp, element, direction));
    } 
    else {
        element.start = null; 
    }
}

// анимация текста Join Us
function animate_join_us(timestamp, start, banner__text_small, phase){
    if (!start) {
        start = timestamp;
    }
    // 7 - магическая цифра, -100 - чтобы текст не был виден на баннере сразу
    let progress = (timestamp - start) / 7 -100;
    // если текст находится в стадии "перемещения"
    if(phase === 'move'){
        banner__text_small.style.opacity = 1;
        banner__text_small.style.top = progress + 'px';
        banner__text_small.style.transition = 'ease-out';
        if (progress < 47) {
            window.requestAnimationFrame((newTimestamp) => animate_join_us(newTimestamp, start, banner__text_small, 'move'));
        }
        // если top > 47, вызываем с фазой "изменение величины шрифта"
        else{
            window.requestAnimationFrame((newTimestamp) => animate_join_us(newTimestamp, start, banner__text_small, 'resize'));
        }
    }
    else if(phase === 'resize'){
        // 900 - магическое число
        let size = (timestamp - start) / 900;
        let text_size = window.getComputedStyle(banner__text_small).fontSize;
        banner__text_small.style.fontSize = parseInt(text_size) + size + 'px';
        if (parseInt(banner__text_small.style.fontSize) < 20.53) {
            window.requestAnimationFrame((newTimestamp) => animate_join_us(newTimestamp, start, banner__text_small, 'resize'));
        }
        else{
            banner__text_small.style.fontSize = 20.53 + 'px';
            start = null; 
        }
    }
}


//функция для появления текста слева
function text_from_left(timestamp, banner__text_big){
    if (!start) {
        start = timestamp;
    }
    // 1ю7 - магическое число
    let progress = (timestamp - start) / 1.7 - 950;
    banner__text_big.style.opacity = 1;
    banner__text_big.style.left = progress + 'px';
    banner__text_big.style.transition = 'ease-out';
    if (progress < 59) {
    window.requestAnimationFrame((newTimestamp) => text_from_left(newTimestamp, banner__text_big));
    }
    else{
        banner__text_big.style.left = 59 + 'px';
        start = null;
    }
}

//функуция запускающая всю анимацию
function letsParty(timestamp){
    if (!start) {
        start = timestamp;
    }
    window.requestAnimationFrame((timestamp) => animate_join_us(timestamp, null, banner__text_small, 'move'));
    setTimeout(() => {
        window.requestAnimationFrame((timestamp) => text_from_left(timestamp, banner__text_big));
    }, 1200);
    setTimeout(() => {
        window.requestAnimationFrame((timestamp) => rotate_element(timestamp, order1, 1));
        window.requestAnimationFrame((timestamp) => rotate_element(timestamp, order3, 1));
        window.requestAnimationFrame((timestamp) => rotate_element(timestamp, order2, -1));
        window.requestAnimationFrame((timestamp) => rotate_element(timestamp, order4, -1));
    }, 1400);
}

//интервал для проигрывания анимации
setInterval(() => {
    resetElements();
    window.requestAnimationFrame((newTimestamp) => letsParty(newTimestamp));
}, 3000);

//ждем полной загрузки страницы
window.onload = () => {window.requestAnimationFrame((newTimestamp) => letsParty(newTimestamp));}
