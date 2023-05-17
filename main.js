var tankInterval;
var bullets = [];

const obstacles = document.querySelectorAll('.obstacle');
const breakableObstacles = document.querySelectorAll('.breakable');

var oldLeft;
var oldTop;

const bulletsText = document.getElementById('bulletsCounter');

const bulletsIconFirst = document.getElementById('firstBullet');
const bulletsIconSecond = document.getElementById('secondBullet');
const bulletsIconThird = document.getElementById('thirdBullet');

var countOfBullets = 3;

var canShot = true;

let shotsRemaining = 3;
let reloading = false;

const loadingBar = document.getElementById('loading-bar');

document.addEventListener("keydown", function(event) {
    var tank = document.getElementById("tank");
    var tankTop = parseInt(window.getComputedStyle(tank).getPropertyValue("top"));
    var tankLeft = parseInt(window.getComputedStyle(tank).getPropertyValue("left"));

   

    // Движение влево
    if (event.key === "ArrowLeft" && tankLeft > 0) {
            oldLeft = tankLeft;
            oldTop = tankTop;
            tank.style.left = tankLeft - 20 + "px";
            tank.style.transform = "rotate(270deg)";
    }
    // Движение вверх
    else if (event.key === "ArrowUp" && tankTop > 0) {
            oldLeft = tankLeft;
            oldTop = tankTop;
            tank.style.top = tankTop - 20 + "px";
            tank.style.transform = "rotate(0deg)";
    }
    // Движение вправо
    else if (event.key === "ArrowRight" && tankLeft < 240) {
            
            tank.style.left = tankLeft + 20 + "px";
            tank.style.transform = "rotate(90deg)";
            oldLeft = tankLeft;
            oldTop = tankTop;
    }
    // Движение вниз
    else if (event.key === "ArrowDown" && tankTop < 240) {
            tank.style.top = tankTop + 20 + "px";
            tank.style.transform = "rotate(180deg)";
            oldLeft = tankLeft;
            oldTop = tankTop;
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

function collision(a, b) {
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

    

    

