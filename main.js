var tankInterval;
var bullets = [];

var tankIntervalSecond;
var bulletsSecond = [];

const obstacles = document.querySelectorAll('.obstacle');
const breakableObstacles = document.querySelectorAll('.breakable');

var oldLeft;
var oldTop;

var oldLeftSecond;
var oldTopSecond;

const bulletsIconFirst = document.getElementById('firstBullet');
const bulletsIconSecond = document.getElementById('secondBullet');
const bulletsIconThird = document.getElementById('thirdBullet');

const bulletsIconFirstSecond = document.getElementById('firstBulletSecond');
const bulletsIconSecondSecond = document.getElementById('secondBulletSecond');
const bulletsIconThirdSecond = document.getElementById('thirdBulletSecond');

const heartIconFirst = document.getElementById('firstHeart');
const heartIconSecond = document.getElementById('secondHeart');
const heartIconThird = document.getElementById('thirdHeart');

const heartIconFirstSecond = document.getElementById('firstHeartSecond');
const heartIconSecondSecond = document.getElementById('secondHeartSecond');
const heartIconThirdSecond = document.getElementById('thirdHeartSecond');

var lives = 3;
var livesSecond = 3;

var countOfBullets = 3;

var canShot = true;

let reloading = false;

const loadingBar = document.getElementById('loading-bar');

var countOfBulletsSecond = 3;

var canShotSecond = true;

let reloadingSecond = false;

const loadingBarSecond = document.getElementById('loading-barSecond');

var tank = document.getElementById("tank");
var tankSecond = document.getElementById("tankSecond");

document.addEventListener("keydown", function(event) {
    var tankTop = parseInt(window.getComputedStyle(tank).getPropertyValue("top"));
    var tankLeft = parseInt(window.getComputedStyle(tank).getPropertyValue("left"));

    var tankSecondTop = parseInt(window.getComputedStyle(tankSecond).getPropertyValue("top"));
    var tankSecondLeft = parseInt(window.getComputedStyle(tankSecond).getPropertyValue("left"));
   

    // Движение влево
    if (event.key === "ArrowLeft" && tankLeft > 0) {
            oldLeft = tankLeft;
            oldTop = tankTop;
            tank.style.left = tankLeft - 20 + "px";
            tank.style.transform = "rotate(270deg)";
            if(collision(tank, tankSecond)){
                tank.style.left = oldLeft + 'px';
                tank.style.top = oldTop + 'px';
                return;
            }
    }
    // Движение вверх
    else if (event.key === "ArrowUp" && tankTop > 0) {
            oldLeft = tankLeft;
            oldTop = tankTop;
            tank.style.top = tankTop - 20 + "px";
            tank.style.transform = "rotate(0deg)";
            if(collision(tank, tankSecond)){
                tank.style.left = oldLeft + 'px';
                tank.style.top = oldTop + 'px';
                return;
            }
    }
    // Движение вправо
    else if (event.key === "ArrowRight" && tankLeft < 240) {
            tank.style.left = tankLeft + 20 + "px";
            tank.style.transform = "rotate(90deg)";

            oldLeft = tankLeft;
            oldTop = tankTop;
            if(collision(tank, tankSecond)){
                tank.style.left = oldLeft + 'px';
                tank.style.top = oldTop + 'px';
                return;
            }
    }
    // Движение вниз
    else if (event.key === "ArrowDown" && tankTop < 240) {
            tank.style.top = tankTop + 20 + "px";
            tank.style.transform = "rotate(180deg)";
            oldLeft = tankLeft;
            oldTop = tankTop;
            if(collision(tank, tankSecond)){
                tank.style.left = oldLeft + 'px';
                tank.style.top = oldTop + 'px';
                return;
            }
    }
    // Выстрел
    else if (event.key === " ") { 
        fireBullet(tankTop, tankLeft, tank.style.transform);
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (collision(tank, obstacle)) {
          // Если танк находится на препятствии, отменить его движение
          tank.style.left = oldLeft + 'px';
          tank.style.top = oldTop + 'px';
          return;
        }
    }


    // Движение влево
    if (event.key === "a" && tankSecondLeft > 0) {
        tankSecond.style.left = tankSecondLeft - 20 + "px";
        tankSecond.style.transform = "rotate(270deg)";

        oldLeftSecond = tankSecondLeft;
        oldTopSecond = tankSecondTop;
        if(collision(tankSecond, tank)){
            tankSecond.style.left = oldLeftSecond + 'px';
            tankSecond.style.top = oldTopSecond + 'px';
            return;
        }
    }
    // Движение вверх
    else if (event.key === "w" && tankSecondTop > 0) {
        tankSecond.style.top = tankSecondTop - 20 + "px";
        tankSecond.style.transform = "rotate(0deg)";

        oldLeftSecond = tankSecondLeft;
        oldTopSecond = tankSecondTop;
        if(collision(tankSecond, tank)){
            tankSecond.style.left = oldLeftSecond + 'px';
            tankSecond.style.top = oldTopSecond + 'px';
            return;
        }
    }
    // Движение вправо
    else if (event.key === "d" && tankSecondLeft < 240) {
        tankSecond.style.left = tankSecondLeft + 20 + "px";
        tankSecond.style.transform = "rotate(90deg)";

        oldLeftSecond = tankSecondLeft;
        oldTopSecond = tankSecondTop;
        if(collision(tankSecond, tank)){
            tankSecond.style.left = oldLeftSecond + 'px';
            tankSecond.style.top = oldTopSecond + 'px';
            return;
        }
    }
    // Движение вниз
    else if (event.key === "s" && tankSecondTop < 240) {
        tankSecond.style.top = tankSecondTop + 20 + "px";
        tankSecond.style.transform = "rotate(180deg)";

        oldLeftSecond = tankSecondLeft;
        oldTopSecond = tankSecondTop;
        if(collision(tankSecond, tank)){
            tankSecond.style.left = oldLeftSecond + 'px';
            tankSecond.style.top = oldTopSecond + 'px';
            return;
        }
    }
    // Выстрел
    else if (event.key === "Control") { 
        fireBulletSecond(tankSecondTop, tankSecondLeft, tankSecond.style.transform);
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (collision(tankSecond, obstacle)) {
          // Если танк находится на препятствии, отменить его движение
          tankSecond.style.left = oldLeftSecond + 'px';
          tankSecond.style.top = oldTopSecond + 'px';
          return;
        }
    }

    
});


function fireBullet(tankTop, tankLeft, tankRotation) {
    if(canShot && countOfBullets > 0){
        var bullet = document.createElement("div");
        countOfBullets--;

        // bulletsText.textContent = countOfBullets;

        resetLoading();

        if(countOfBullets == 2){
            bulletsIconThird.setAttribute('src', './images/bullEmpty.png');
        } if(countOfBullets == 1){
            bulletsIconThird.setAttribute('src', './images/bullEmpty.png');
            bulletsIconSecond.setAttribute('src', './images/bullEmpty.png');
        }

        if(countOfBullets == 0){
            bulletsIconThird.setAttribute('src', './images/bullEmpty.png');
            bulletsIconSecond.setAttribute('src', './images/bullEmpty.png');
            bulletsIconFirst.setAttribute('src', './images/bullEmpty.png');
            startLoading();
            setTimeout(() => {
                countOfBullets = 3;
                // bulletsText.textContent = countOfBullets;
                bulletsIconThird.setAttribute('src', './images/bull.png');
                bulletsIconSecond.setAttribute('src', './images/bull.png');
                bulletsIconFirst.setAttribute('src', './images/bull.png');
            }, 3000);
        }   

        var bulletTop = tankTop - 10;
        var bulletLeft = tankLeft + 8;

        if (tankRotation === "rotate(0deg)") {
            bullet.classList.add("bulletTop");
            bulletTop = tankTop - 10;
            bulletLeft = tankLeft + 8;
        } else if (tankRotation === "rotate(90deg)") {
            bullet.classList.add("bulletLeft");
            bulletTop = tankTop + 8;
            bulletLeft = tankLeft + 20; 
        } else if (tankRotation === "rotate(180deg)"){
            bullet.classList.add("bulletTop");
            bulletTop = tankTop + 20;
            bulletLeft = tankLeft + 8; 
        }else if (tankRotation === "rotate(270deg)") {
            bullet.classList.add("bulletLeft");
            bulletTop = tankTop + 8;
            bulletLeft = tankLeft - 10; 
        }
    
    }
    //set position
    bullet.style.top = bulletTop + "px";
    bullet.style.left = bulletLeft + "px";
    document.getElementById("game-container").appendChild(bullet);
    bullets.push(bullet);
    
    canShot = false;

    setTimeout(() => {
        canShot = true;
    }, 500);

    var bulletInterval = setInterval(function() {
        shotEnemy(bullet, tankSecond);
        checkCollision();

        // Проверить, не пересекается ли пуля с каким-либо препятствием
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (collision(bullet, obstacle)) {
                // Если пуля пересекается с препятствием, удалить пулю и прекратить выполнение функции
                bullet.remove();
                return;
            }
        }

        //moving        
        if (tankRotation === "rotate(0deg)") {
            bulletTop -= 5;
            bullet.style.top = bulletTop + "px";        
        } else if (tankRotation === "rotate(90deg)") {
            bulletLeft += 5;
            bullet.style.left = bulletLeft + "px"; 
        } else if (tankRotation === "rotate(180deg)"){
            bulletTop += 5;
            bullet.style.top = bulletTop + "px"; 
        }else if (tankRotation === "rotate(270deg)") {
            bulletLeft -= 5;
            bullet.style.left = bulletLeft + "px"; 
        }


        //removing
        if (bulletTop < 0 || bulletTop > 260 || bulletLeft < 0 || bulletLeft > 260) {
            clearInterval(bulletInterval);
            bullet.remove();
            var index = bullets.indexOf(bullet);
            if (index > -1) {
                bullets.splice(index, 1);
            }
        }
    }, 10);
}


function fireBulletSecond(tankTop, tankLeft, tankRotation) {
    if(canShotSecond && countOfBulletsSecond > 0){
        var bullet = document.createElement("div");
        countOfBulletsSecond--;

       

        //TODO:
        resetLoadingSecond();

      
        if(countOfBulletsSecond == 2){
            bulletsIconThirdSecond.setAttribute('src', './images/bullEmpty.png');
        } if(countOfBulletsSecond == 1){
            bulletsIconThirdSecond.setAttribute('src', './images/bullEmpty.png');
            bulletsIconSecondSecond.setAttribute('src', './images/bullEmpty.png');
        }

        if(countOfBulletsSecond == 0){
            bulletsIconThirdSecond.setAttribute('src', './images/bullEmpty.png');
            bulletsIconSecondSecond.setAttribute('src', './images/bullEmpty.png');
            bulletsIconFirstSecond.setAttribute('src', './images/bullEmpty.png');
            startLoadingSecond();
            setTimeout(() => {
                countOfBulletsSecond = 3;
                
                bulletsIconThirdSecond.setAttribute('src', './images/bull.png');
                bulletsIconSecondSecond.setAttribute('src', './images/bull.png');
                bulletsIconFirstSecond.setAttribute('src', './images/bull.png');
            }, 3000);
        }   

        var bulletTop = tankTop - 10;
        var bulletLeft = tankLeft + 8;

        if (tankRotation === "rotate(0deg)") {
            bullet.classList.add("bulletTop");
            bulletTop = tankTop - 10;
            bulletLeft = tankLeft + 8;
        } else if (tankRotation === "rotate(90deg)") {
            bullet.classList.add("bulletLeft");
            bulletTop = tankTop + 8;
            bulletLeft = tankLeft + 20; 
        } else if (tankRotation === "rotate(180deg)"){
            bullet.classList.add("bulletTop");
            bulletTop = tankTop + 20;
            bulletLeft = tankLeft + 8; 
        }else if (tankRotation === "rotate(270deg)") {
            bullet.classList.add("bulletLeft");
            bulletTop = tankTop + 8;
            bulletLeft = tankLeft - 10; 
        }
    
    }
    //set position
    bullet.style.top = bulletTop + "px";
    bullet.style.left = bulletLeft + "px";
    document.getElementById("game-container").appendChild(bullet);
    bulletsSecond.push(bullet);
    
    canShotSecond = false;

    setTimeout(() => {
        canShotSecond = true;
    }, 500);

    var bulletInterval = setInterval(function() {
        shotEnemy(bullet, tank);
        checkCollisionSecond();

        // Проверить, не пересекается ли пуля с каким-либо препятствием
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (collision(bullet, obstacle)) {
                // Если пуля пересекается с препятствием, удалить пулю и прекратить выполнение функции
                bullet.remove();
                return;
            }
        }

        //moving        
        if (tankRotation === "rotate(0deg)") {
            bulletTop -= 5;
            bullet.style.top = bulletTop + "px";        
        } else if (tankRotation === "rotate(90deg)") {
            bulletLeft += 5;
            bullet.style.left = bulletLeft + "px"; 
        } else if (tankRotation === "rotate(180deg)"){
            bulletTop += 5;
            bullet.style.top = bulletTop + "px"; 
        }else if (tankRotation === "rotate(270deg)") {
            bulletLeft -= 5;
            bullet.style.left = bulletLeft + "px"; 
        }


        //removing
        if (bulletTop < 0 || bulletTop > 260 || bulletLeft < 0 || bulletLeft > 260) {
            clearInterval(bulletInterval);
            bullet.remove();
            var index = bulletsSecond.indexOf(bullet);
            if (index > -1) {
                bulletsSecond.splice(index, 1);
            }
        }
    }, 10);
}

function checkCollision() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];

        // Проверяем столкновение пули с разрушаемыми блоками
        for (let j = 0; j < breakableObstacles.length; j++) {
            const obstacle = breakableObstacles[j];
            if (collision(bullet, obstacle)) {
                // Удаляем пулю
                bullet.remove();
                bullets.splice(i, 1);
                
                // Удаляем разрушаемый блок
                obstacle.remove();
                breakableObstacles.splice(j, 1);
                break;
            }
        }
    }
}

function shotEnemy(bullet, enemy){
    if (collision(bullet, enemy)) {      
        tank.style.top = 240 + "px";
        tank.style.left = 120 + "px";
        tank.style.transform = 'rotate(0deg)';

        tankSecond.style.top = 0 + "px";
        tankSecond.style.left = 0 + "px";
        tankSecond.style.transform = 'rotate(180deg)'
        removeHeart(enemy);
        restartGame();
    }
}

function removeHeart(enemy){
    if(enemy === tank){
        lives--;
        if(lives == 2){
            heartIconThird.setAttribute('src', './images/heatHeart.png');
        }if(lives == 1){
            heartIconSecond.setAttribute('src', './images/heatHeart.png');
        }if(lives == 0){
            heartIconFirst.setAttribute('src', './images/heatHeart.png');
            alert("Won player two");
            location.reload();
        }
    }if(enemy === tankSecond){
        livesSecond--;
        if(livesSecond == 2){
            heartIconThirdSecond.setAttribute('src', './images/heatHeart.png');
        }if(livesSecond == 1){
            heartIconSecondSecond.setAttribute('src', './images/heatHeart.png');
        }if(livesSecond == 0){
            heartIconFirstSecond.setAttribute('src', './images/heatHeart.png');
            alert("Won player one");
            location.reload();
        }
    }
}

function restartGame(){
    bullets = [];
    bulletsSecond = [];
    
}

function checkCollisionSecond() {
    for (let i = 0; i < bulletsSecond.length; i++) {
        const bullet = bulletsSecond[i];

        // Проверяем столкновение пули с разрушаемыми блоками
        for (let j = 0; j < breakableObstacles.length; j++) {
            const obstacle = breakableObstacles[j];
            if (collisionSecond(bullet, obstacle)) {
                // Удаляем пулю
                bullet.remove();
                bulletsSecond.splice(i, 1);
                
                // Удаляем разрушаемый блок
                obstacle.remove();
                breakableObstacles.splice(j, 1);
                break;
            }
        }
    }
}

function collision(a, b) {
    const aRect = a.getBoundingClientRect();
    const tank = b.getBoundingClientRect();
    return !(
      (aRect.bottom <= tank.top) || (aRect.top >= tank.bottom) ||
      (aRect.right <= tank.left) || (aRect.left >= tank.right)
    );
}

function collisionSecond(a, b) {
    const aRect = a.getBoundingClientRect();
    const tank = b.getBoundingClientRect();
    return !(
      (aRect.bottom <= tank.top) || (aRect.top >= tank.bottom) ||
      (aRect.right <= tank.left) || (aRect.left >= tank.right)
    );
}


function resetLoading() {
    loadingBar.style.transition = 'width 0.5s';
    loadingBar.style.width = '0';
}

function startLoading() {
    loadingBar.style.transition = 'width 3s';
    loadingBar.style.width = '100%';
}

function resetLoadingSecond() {
    loadingBarSecond.style.transition = 'width 0.5s';
    loadingBarSecond.style.width = '0';
}

function startLoadingSecond() {
    loadingBarSecond.style.transition = 'width 3s';
    loadingBarSecond.style.width = '100%';
}



