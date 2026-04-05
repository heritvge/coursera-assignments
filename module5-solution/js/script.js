(function (global) {

    // STEP 0: Создаем переменную для случайной категории
    var randomCategoryShortName = null;

    // Функция для получения случайной категории с сервера
    function getRandomCategory() {
        $.ajax({
            url: 'https://coursera-jhu-default-rtdb.firebaseio.com/categories.json',
            type: 'GET',
            async: false,
            success: function(data) {
                var categories = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        categories.push(data[key]);
                    }
                }
                var randomIndex = Math.floor(Math.random() * categories.length);
                randomCategoryShortName = categories[randomIndex].short_name;
            },
            error: function() {
                console.log("Error loading categories");
                randomCategoryShortName = 'SP'; // fallback
            }
        });
    }

    // Загружаем случайную категорию при загрузке страницы
    getRandomCategory();

    // Обновляем ссылку на Specials с правильной случайной категорией
    $(document).ready(function() {
        // Находим ссылку Specials и обновляем её onclick
        $('a[onclick*="loadMenuItems({{randomCategoryShortName}})"]').each(function() {
            var newOnClick = "$dc.loadMenuItems('" + randomCategoryShortName + "');";
            $(this).attr('onclick', newOnClick);
        });
    });

    // Остальной код из оригинального script.js
    var dc = {};

    // Загрузка категорий меню
    dc.loadMenuCategories = function() {
        $.ajax({
            url: 'https://coursera-jhu-default-rtdb.firebaseio.com/categories.json',
            type: 'GET',
            success: function(data) {
                var html = '<div class="container"><h2>Menu Categories</h2><div class="row">';
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var cat = data[key];
                        html += '<div class="col-md-3 col-sm-4 col-xs-6">';
                        html += '<a href="#" onclick="$dc.loadMenuItems(\'' + cat.short_name + '\');">';
                        html += '<div class="category-tile">';
                        html += '<div class="category-photo">';
                        html += '<img src="images/menu/' + cat.short_name + '.jpg" alt="' + cat.name + '" width="200" height="200">';
                        html += '</div>';
                        html += '<span>' + cat.name + '</span>';
                        html += '</div></a></div>';
                    }
                }
                html += '</div></div>';
                $('#main-content').html(html);
            },
            error: function() {
                $('#main-content').html('<div class="container"><div class="alert alert-danger">Error loading menu categories. Please try again later.</div></div>');
            }
        });
    };

    // Загрузка элементов меню по категории
    dc.loadMenuItems = function(categoryShortName) {
        $.ajax({
            url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/' + categoryShortName + '.json',
            type: 'GET',
            success: function(data) {
                var categoryName = '';
                var menuItems = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (key === 'category') {
                            categoryName = data[key].name;
                        } else if (typeof data[key] === 'object' && data[key] !== null) {
                            menuItems.push(data[key]);
                        }
                    }
                }
                
                var html = '<div class="container"><h2>' + categoryName + ' Menu</h2><div class="row">';
                for (var i = 0; i < menuItems.length; i++) {
                    var item = menuItems[i];
                    html += '<div class="menu-item-tile col-md-6">';
                    html += '<div class="row">';
                    html += '<div class="col-sm-5">';
                    html += '<div class="menu-item-photo">';
                    html += '<div>' + item.short_name + '</div>';
                    html += '<img class="img-responsive" width="250" height="150" src="images/menu/' + categoryShortName + '/' + item.short_name + '.jpg" alt="Item">';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="menu-item-description col-sm-7">';
                    html += '<h3 class="menu-item-title">' + item.name + '</h3>';
                    html += '<p class="menu-item-details">' + (item.description || 'No description available') + '</p>';
                    html += '</div>';
                    html += '</div>';
                    html += '<hr class="visible-xs">';
                    html += '</div>';
                }
                html += '</div></div>';
                $('#main-content').html(html);
            },
            error: function() {
                $('#main-content').html('<div class="container"><div class="alert alert-danger">Error loading menu items. Please try again later.</div></div>');
            }
        });
    };

    global.$dc = dc;

    // Загружаем категории при загрузке страницы
    $(document).ready(function() {
        $dc.loadMenuCategories();
    });

})(window);
