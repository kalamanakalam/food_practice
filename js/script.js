window.addEventListener('DOMContentLoaded', function() {

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
	});

    // Timer
    const deadline = "2024-11-11"

    function getTimer(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0){
            days = 0,
            hours = 0,
            minutes = 0,
            seconds = 0;
        }else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        }
    }

    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        }else {
            return num;
        }
    }

    function SetClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(uppdateClock, 1000);

        uppdateClock();
        function uppdateClock() {
            const t = getTimer(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }

    SetClock('.timer', deadline);

    //modal
    const modalBtn = document.querySelectorAll('[data-modal]'),
          modalForm = document.querySelector('.modal');
    
    function OpenModal() {
        modalForm.classList.add('show');
        modalForm.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    modalBtn.forEach(item => {
        item.addEventListener('click', OpenModal);
    });

    function CloseModal() {
        modalForm.classList.add('hide');
        modalForm.classList.remove('show');
        document.body.style.overflow = ''; 
    }

    modalForm.addEventListener('click', (e) => {
        if(e.target === modalForm || e.target.getAttribute('data-close') == '') { // использование назначение атрибута как условие == '' значит что ничего не добавляем
            CloseModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modalForm.classList.contains('show')) {
            CloseModal();
        }
    })

    const modalTimer = setTimeout(OpenModal, 50000);

    function showMyModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            OpenModal();
            window.removeEventListener('scroll', showMyModalByScroll);
        }
    }

    window.addEventListener('scroll', showMyModalByScroll);

    // dynamic 
    let menuItem = document.querySelectorAll('.menu__item');
    
    class MenuItem {
        constructor(imgSrc, alt, textMenu, textofMenu, price) {
            this.imgSrc = imgSrc;
            this.alt = alt;
            this.textMenu = textMenu;
            this.textofMenu = textofMenu;
            this.price = price;
            this.transfer = 41;
            this.changeToUAH();
        }
        
        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        postAPage(menuItem) {
            let menuImg = menuItem.querySelector('img'),
                textSubtitle = menuItem.querySelector('.menu__item-subtitle'),
                textDescr = menuItem.querySelector('.menu__item-descr'),
                priceTotal = menuItem.querySelector('.menu__item-total');
        
            menuImg.src = this.imgSrc;
            menuImg.alt = this.alt;
            textSubtitle.textContent = `${this.textMenu}`;
            textDescr.textContent = `${this.textofMenu}`;
            priceTotal.innerHTML = `<span>${this.price}</span> грн/день`;
        }

    }

    axios.get('http://localhost:3000/menu')
    .then(data => {
        let y = 0;
        data.data.forEach(({img, altimg, title, descr, price}) =>{
            new MenuItem(img, altimg, title, descr, price).postAPage(menuItem[y]);
            y++;
        });
    });

    //offer  //Мой вариант 
        // class OfferPrompt {
        //     constructor(total, srcArr, alt){
        //         this.total = total;
        //         this.srcArr = srcArr.split(' ');
        //         this.alt = alt.split(' ');
        //         this.current = 1;
        //         this.nullishPos();
        //     }
            
        //     nullishPos() {
        //         let total = document.querySelector('#total'),
        //             currentSite = document.querySelector('#current'),
        //             imgOffer = document.querySelector('.offer__slider-wrapper');
        //         total.textContent = `0${this.total}`;
        //         currentSite.textContent = `0${this.current}`;
        //         imgOffer.innerHTML = `
        //             <div class="offer__slide">
        //                 <img src="img/slider/${this.srcArr[0]}" alt="${this.alt[0]}">
        //             </div>`
        //     }

        //     Render() {
        //         let counterSlide =document.querySelector('.offer__slider-counter'),
        //             imgOffer = document.querySelector('.offer__slider-wrapper'),
        //             currentSite = document.querySelector('#current');
                    
        //         counterSlide.addEventListener('click', (e) => {
        //             if(e.target.classList.contains('offer__slider-prev')) {
        //                 if(this.current > 1){
        //                     this.current--;
        //                     currentSite.textContent = `0${this.current}`;
        //                     imgOffer.innerHTML = `
        //                         <div class="offer__slide">
        //                             <img src="img/slider/${this.srcArr[this.current - 1]}" alt="${this.alt[this.current - 1]}">
        //                         </div>`
        //                 }
        //             }else if(e.target.classList.contains('offer__slider-next')){
        //                 if(this.current < this.total) {
        //                     this.current ++;
        //                     currentSite.textContent = `0${this.current}`;
        //                     imgOffer.innerHTML = `
        //                         <div class="offer__slide">
        //                             <img src="img/slider/${this.srcArr[this.current - 1]}" alt="${this.alt[this.current - 1]}">
        //                         </div>`
        //                 }
        //             }
        //         })
        //     }
        // }

        // new OfferPrompt(4, 'pepper.jpg food-12.jpg olive-oil.jpg paprika.jpg', 'pepper food oil paprika').Render();

    // modalform post

    const forms = document.querySelectorAll('form');
    const messages = {
        loading: 'img/form/spinner.svg',
        success: 'Успешно мы скоро с вами свяжемся',
        error: 'Произошла ошибка'
    };

    forms.forEach(item => {
        bindPostData(item);
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: data
        });

        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.style.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.append(statusMessage);

            // request.setRequestHeader('Content-type', 'multipart/form-data'); при связке XMLHttpRequest и formData заголовок сам ставиться 
            // const formData = new FormData(form);
            // request.send(formData);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(messages.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(messages.error);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const dialog = document.querySelector('.modal__dialog');
        dialog.classList.add('hide');
        OpenModal();
        const title = document.createElement('div');
        title.classList.add('modal__dialog');
        title.innerHTML = `
        <div class = "modal__content">
            <div class = "modal__close">×</div>
            <div class = "modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(title);
        setTimeout(()=>{
            title.remove();
            dialog.classList.add('show');
            dialog.classList.remove('hide');
            CloseModal();
        }, 5000)
    }
    // вариант с урока карусель //offer 

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slideWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slideWrapper).width;
    
    let sliderIndex = 1;
    let offset = 0;
    let initialX = 0;
    let currentX = 0;
    let differentX = 0;
    //первоначальная настройка счетчика
    if(slides.length < 10) {
        total.textContent = `0${slides.length}`
        current.textContent = `0${sliderIndex}`
    }else {
        total.length = slide.length;
        current.length = sliderIndex;
    }

    //настройка карусели 
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slideWrapper.style.overflow = 'hidden';

    //приравнивание всех картинок к одному стандарту 
    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    let indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for(let i = 0; i < slides.length; i++) {
        let dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        indicators.append(dot);
        if(i == 0) {
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }

    //кнопочки назад вперед
    next.addEventListener('click', nextEvent);
    prev.addEventListener('click', prevEvent);

    //drag событие 
    slides.forEach(slide => {
        const imgSlide = slide.querySelector('img');
        imgSlide.addEventListener('dragstart', (e) => {
            e.dataTransfer.setDragImage(new Image(), 0, 0);
            initialX = e.clientX;
          
        });
        imgSlide.addEventListener('drag', (e) => {
            currentX = e.clientX;
            if(currentX > 0){
                differentX = currentX - initialX;
            }        
        });
        imgSlide.addEventListener('dragend', () => {
            if(differentX < 0) {
                prevEvent();
            }else if(differentX > 0){
                nextEvent();
            }
        })
    });

    function nextEvent() {
        if(offset == converttoNum(width) * (slides.length - 1)){
            offset = 0;
        }else{
            offset += converttoNum(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(sliderIndex == slides.length) {
            sliderIndex = 1;
        }else {
            sliderIndex++;
        }

        showSliderIndex();
        changeDotsOpaccity();
    }

    function prevEvent() {
        if( offset == 0){
            offset = converttoNum(width) * (slides.length - 1);
        }else{
            offset -= converttoNum(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(sliderIndex == 1) {
            sliderIndex = slides.length;
        }else {
            sliderIndex--;
        }

        showSliderIndex();
        changeDotsOpaccity();
    }
   
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
           const slideTo = e.target.getAttribute('data-slide-to');
           sliderIndex = slideTo;

           offset = converttoNum(width) * (slideTo - 1);
           slidesField.style.transform = `translateX(-${offset}px)`;

           showSliderIndex();
           changeDotsOpaccity();
        });
    });
    
    function showSliderIndex() {
        if(sliderIndex < 10) {
            current.textContent = `0${sliderIndex}`;
        }else{
            current.textContent = sliderIndex;
        }
    }

    function changeDotsOpaccity() {
        dots.forEach(dot => dot.style.opacity = 0.5);
        dots[sliderIndex - 1].style.opacity = 1;
    }

    function converttoNum(wstr) {
        return +wstr.replace(/\D/g, '');
    }
    //calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female', height, weight, age, ratio = 1.375;

    function calcCall() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = "____";
            return;
        }

        if(sex == 'female') {
            result.textContent = Math.round((447.6 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }
    }

    calcCall();

    function getStaticInformation(parentSelector, ActiveClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);
        document.querySelector(parentSelector).addEventListener('click', (e) => {
            if(e.target.getAttribute('data-ratio') && e.target.classList.contains('calculating__choose-item')) {
                ratio = +e.target.getAttribute('data-ratio');
            }else if (e.target.classList.contains('calculating__choose-item')){
                sex = e.target.getAttribute('id');
            }

            if(e.target.classList.contains('calculating__choose-item')) {
                elements.forEach(element => {
                    element.classList.remove(ActiveClass);
                });

                e.target.classList.add(ActiveClass);
            }
            calcCall();
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcCall();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});



