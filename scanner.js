// هذا المتغير نحتاجوه لزر التثبيت
let deferredPrompt;

// هادي الفونكشن تتنفذ كي يكمل تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {

    // --- (1) تسجيل الـ Service Worker (تاع الأوفلاين) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('Service Worker registration failed: ', registrationError);
                });
        });
    }

    // --- (2) إعداد السكانر (الكود الأصلي) ---
    const html5QrCode = new Html5Qrcode("reader");

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // decodedText هو الرابط (URL) لي لقاه في الكود
        console.log(`الكود لي لقاه: ${decodedText}`);

        // افتح الرابط لي لقيتو في نفس النافذة
        window.location.href = decodedText;

        // (اختياري) تحبيس السكانر بعد ما يلقى الكود
        html5QrCode.stop().catch(err => console.log("خطأ في إيقاف السكانر", err));
    };

    // إعدادات الكاميرا
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
    };

    // تشغيل الكاميرا الخلفية
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch(err => {
            console.log("المستعمل رفض الكاميرا أو كاين خطأ: " + err);
            alert("لازم تسمح للكاميرا باش يخدم السكانر!");
        });

});


// --- (3) كود زر التثبيت اليدوي (جديد) ---
// هذا الكود يستنى المتصفح يقول "راني واجد للتثبيت"
window.addEventListener('beforeinstallprompt', (e) => {
    // امنع النافذة الأوتوماتيكية
    e.preventDefault();
    
    // احفظ الحدث باش نقدرو نستعملوه كي نكليكيو على الزر
    deferredPrompt = e;
    
    // درك نظهرو الزر تاعنا لي خبيناه
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';
    }
    
    // نستناو المستعمل يكليكي على الزر تاعنا
    installButton.addEventListener('click', (clickEvent) => {
        // نخفي الزر (صايي كليكينا عليه)
        installButton.style.display = 'none';
        // نظهرو نافذة التثبيت الحقيقية
        deferredPrompt.prompt();
        // ننتظرو النتيجة (قبل أو رفض)
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('المستعمل قبل تثبيت التطبيق');
            } else {
                console.log('المستعمل رفض تثبيت التطبيق');
            }
            deferredPrompt = null; // نمسحو الحدث
        });
    });
});