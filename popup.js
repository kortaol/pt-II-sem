// Получаем элементы
const toggleBtn = document.getElementById('togglePopup');
const closeBtn = document.getElementById('closePopup');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const body = document.body;

// Функция открытия окна
function openPopup() {
    overlay.classList.add('active');
    popup.classList.add('active');
    body.classList.add('no-scroll');
    // toggleBtn.textContent = 'Закрыть окно';
}

// Функция закрытия окна
function closePopup() {
    overlay.classList.remove('active');
    popup.classList.remove('active');
    body.classList.remove('no-scroll');
    // toggleBtn.textContent = 'Открыть окно';
}

// Функция переключения
function togglePopup() {
    if (popup.classList.contains('active')) {
        closePopup();
    } else {
        openPopup();
    }
}

// Обработчики событий
toggleBtn.addEventListener('click', togglePopup);
closeBtn.addEventListener('click', closePopup);

// Закрытие по клику на оверлей
overlay.addEventListener('click', closePopup);

// Закрытие по клавише Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
        closePopup();
    }
});

openPopup(); // По дефолту открыто
