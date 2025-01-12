const canvas = document.getElementById("twibbonCanvas");
const ctx = canvas.getContext("2d");
const uploadImage = document.getElementById("uploadImage");
const changeFrameFile = document.getElementById("changeFrameFile");
const downloadBtn = document.getElementById("downloadBtn");
const scaleSlider = document.getElementById("scaleSlider");
const rotateButton = document.getElementById("rotateBtn");

canvas.width = 400;
canvas.height = 400;

let twibbonFrame = new Image();
twibbonFrame.src = "default-frame.png"; // Frame default
let uploadedImageSrc = null; // Untuk gambar yang diunggah pengguna.
let scale = 1; // Skala default untuk gambar.
let rotationAngle = 0; // Sudut rotasi awal

// Fungsi menggambar ulang canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (uploadedImageSrc) {
        const uploadedImage = new Image();
        uploadedImage.onload = () => {
            const scaledWidth = uploadedImage.width * scale;
            const scaledHeight = uploadedImage.height * scale;

            // Simpan konteks dan pindahkan titik rotasi ke tengah canvas
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotationAngle * Math.PI) / 180);

            // Gambar gambar utama
            ctx.drawImage(
                uploadedImage,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );

            // Kembalikan konteks ke posisi awal
            ctx.restore();

            // Gambar frame di atas gambar utama
            ctx.drawImage(twibbonFrame, 0, 0, canvas.width, canvas.height);
        };
        uploadedImage.src = uploadedImageSrc;
    } else {
        // Jika tidak ada gambar yang diunggah, hanya gambar frame default
        ctx.drawImage(twibbonFrame, 0, 0, canvas.width, canvas.height);
    }
}

// Event listener untuk tombol Upload Image
uploadImage.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageSrc = e.target.result;
        redrawCanvas();
    };
    reader.readAsDataURL(file);
});

// Event listener untuk tombol Change Frame
changeFrameFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        twibbonFrame = new Image();
        twibbonFrame.onload = () => redrawCanvas();
        twibbonFrame.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Event listener untuk slider scaling
scaleSlider.addEventListener("input", (event) => {
    scale = parseFloat(event.target.value); // Ambil nilai scaling dari slider
    redrawCanvas(); // Gambar ulang canvas dengan skala baru
});

// Event listener untuk tombol Rotate
rotateButton.addEventListener("click", () => {
    rotationAngle = (rotationAngle + 90) % 360; // Tambah rotasi sebesar 90 derajat
    redrawCanvas(); // Gambar ulang dengan rotasi baru
});

// Event listener untuk tombol Download
let imageUploaded = false; // Status gambar
let frameUploaded = false; // Status frame

// Update status ketika gambar diunggah
document.getElementById("uploadImage").addEventListener("change", function () {
    if (this.files && this.files[0]) {
        imageUploaded = true;
    }
});

// Update status ketika frame diunggah
document.getElementById("changeFrameFile").addEventListener("change", function () {
    if (this.files && this.files[0]) {
        frameUploaded = true;
    }
});

// Validasi tombol download
document.getElementById("downloadBtn").addEventListener("click", function () {
    if (!imageUploaded || !frameUploaded) {
        alert("Mohon upload gambar dan frame terlebih dahulu.");
    } else {
        // Logika download file di sini
        alert("File siap untuk diunduh!");
    }
});


// Muat ulang canvas dengan frame default saat pertama kali dijalankan
twibbonFrame.onload = redrawCanvas;

// fungsi untuk tombol salin
document.getElementById("copyCaptionBtn").addEventListener("click", function () {
    const captionTextarea = document.getElementById("caption");
    captionTextarea.select(); // Pilih teks di textarea
    captionTextarea.setSelectionRange(0, 99999); // Untuk mendukung browser lama
    navigator.clipboard.writeText(captionTextarea.value) // Salin teks ke clipboard
        .then(() => {
            alert("Caption berhasil disalin!");
        })
        .catch(() => {
            alert("Gagal menyalin caption. Silakan salin secara manual.");
        });
});
