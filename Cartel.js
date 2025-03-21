window.onload = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Ajustar el tamaño del canvas para que ocupe toda la ventana
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let mouseX = -100, mouseY = -100; 
    let fillColor = "transparent"; 
    const margin = 20; 

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener("click", (e) => {
        const rectX = margin;
        const rectY = margin;
        const rectWidth = canvas.width - margin * 2;
        const rectHeight = canvas.height - margin * 2;

        if (
            e.clientX >= rectX && e.clientX <= rectX + rectWidth &&
            e.clientY >= rectY && e.clientY <= rectY + rectHeight
        ) {
            fillColor = getRandomDarkColor();
        }
    });

    function getRandomDarkColor() {
        let colors = [
            "#000000", "#F2CE16", "#8C1F28", "##035AA6", "#F2668B", // Negros
            "#F26800", "#FFEC5C", "#400036" // Azules oscuros
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawBackground() {
        let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#000000");  
        gradient.addColorStop(0.5, "#8C1F28"); 
        gradient.addColorStop(1, "#F2CE16");  
        
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawRectangle() {
        ctx.fillStyle = fillColor; 
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.rect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);
        ctx.fill();  
        ctx.stroke(); 
    }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = -Math.PI / 2;
        let step = Math.PI / spikes;

        ctx.save();
        ctx.translate(cx, cy);

        ctx.beginPath();
        for (let i = 0; i < spikes; i++) {
            let x = Math.cos(rot) * outerRadius;
            let y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    class Star {
        constructor(x, y, spikes, outerRadius, innerRadius, color) {
            this.x = x;
            this.y = y;
            this.spikes = spikes;
            this.outerRadius = outerRadius;
            this.innerRadius = innerRadius;
            this.color = color;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = (Math.random() - 0.5) * 10;
            this.fixSpeed();
        }

        fixSpeed() {
            if (Math.abs(this.speedX) < 2) this.speedX = (Math.random() - 0.5) * 10;
            if (Math.abs(this.speedY) < 2) this.speedY = (Math.random() - 0.5) * 10;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x + this.outerRadius > canvas.width || this.x - this.outerRadius < 0) {
                this.speedX *= -1;
                this.fixSpeed();
                addNewStar();
            }

            if (this.y + this.outerRadius > canvas.height || this.y - this.outerRadius < 0) {
                this.speedY *= -1;
                this.fixSpeed();
                addNewStar();
            }
        }

        draw() {
            drawStar(this.x, this.y, this.spikes, this.outerRadius, this.innerRadius, this.color);
        }
    }

    function getRandomRedPinkColor() {
        const redTones = ["#FF4D6D", "#FF165D", "#D90429", "#FF758F", "#FF1E56"];
        return redTones[Math.floor(Math.random() * redTones.length)];
    }

    let stars = [
        new Star(canvas.width / 4, canvas.height / 1.5, 6, 80, 30, getRandomRedPinkColor()),
        new Star(canvas.width / 2, canvas.height / 1.5, 6, 80, 30, getRandomRedPinkColor()),
        new Star(canvas.width * 0.75, canvas.height / 1.5, 6, 80, 30, getRandomRedPinkColor())
    ];

    let lastSpawnTime = Date.now();

    function addNewStar() {
        if (stars.length < 25 && Date.now() - lastSpawnTime > 500) {
            let newStar = new Star(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                6,
                Math.random() * 50 + 30,
                Math.random() * 20 + 10,
                getRandomRedPinkColor()
            );
            stars.push(newStar);
            lastSpawnTime = Date.now();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawRectangle();

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        ctx.globalCompositeOperation = "color-dodge"; 
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 100, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawBackground();
    });

    animate();
};
// Cambiar mayúsculas/minúsculas con espacio
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault(); 
        toggleCase(["K", "e", "e1", "P", "f", "a", "S", "h", "I", "O", "n", "W", "e2", "I2", "r", "d"]);
    }
});

function toggleCase(ids) {
    ids.forEach(id => {
        let textElement = document.getElementById(id);
        if (textElement) { 
            let currentText = textElement.innerText;
            textElement.innerText = (currentText === currentText.toUpperCase()) ? currentText.toLowerCase() : currentText.toUpperCase();
        }
    });
}