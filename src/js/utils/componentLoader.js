
/**
 * @param {string} id - ID элемента, в который будет вставлен компонент
 * @param {string} file - Путь к HTML файлу компонента
 * @param {Function} callback - Функция обратного вызова после загрузки
 */
export function loadComponent(id, file, callback) {
    
    fetch(file)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then((data) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (callback) {
                    callback();
                }
            }
        })
}

