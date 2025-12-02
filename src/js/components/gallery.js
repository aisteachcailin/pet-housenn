import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export function initFancyboxGallery() {
    Fancybox.bind("[data-fancybox]", {
        Thumbs: {
            type: "modern",
        },
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [
                    "zoomIn",
                    "zoomOut",
                    "toggle1to1",
                    "rotateCCW",
                    "rotateCW",
                    "flipX",
                    "flipY",
                ],
                right: [
                    "slideshow",
                    "fullscreen",
                    "download",
                    "thumbs",
                    "close",
                ],
            },
        },
        Images: {
            zoom: true,
            wheel: "slide",
        },
        Carousel: {
            infinite: true,
            transition: "slide",
            friction: 0.3,
        },
        l10n: {
            CLOSE: "Закрыть",
            NEXT: "Вперед",
            PREV: "Назад",
            MODAL: "Вы можете закрыть это модальное окно с помощью клавиши ESC",
            ERROR: "Что-то пошло не так. Пожалуйста, попробуйте позже",
            IMAGE_ERROR: "Изображение не найдено",
            ELEMENT_NOT_FOUND: "HTML элемент не найден",
            AJAX_NOT_FOUND: "Ошибка загрузки AJAX : Не найдено",
            AJAX_FORBIDDEN: "Ошибка загрузки AJAX : Запрещено",
            IFRAME_ERROR: "Ошибка загрузки страницы",
            TOGGLE_ZOOM: "Переключить уровень масштабирования",
            TOGGLE_THUMBS: "Переключить миниатюры",
            TOGGLE_SLIDESHOW: "Переключить слайдшоу",
            TOGGLE_FULLSCREEN: "Переключить полноэкранный режим",
            DOWNLOAD: "Скачать",
        },
    });
}

