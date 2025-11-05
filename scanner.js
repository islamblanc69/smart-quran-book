// هادي الفونكشن تتنفذ كي يكمل تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {

    // 1. إعداد السكانر
    // نقولولو اخدم سكانر جديد وحطو في العنصر #reader
    const html5QrCode = new Html5Qrcode("reader");

    // 2. واش دير كي تلقى كود (هادي أهم حاجة)
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // decodedText هو الرابط (URL) لي لقاه في الكود
        console.log(`الكود لي لقاه: ${decodedText}`);

        // هنا نقولولو: "افتح الرابط لي لقيتو في نفس النافذة"
        window.location.href = decodedText;

        // (اختياري) تقدر تحبس السكانر بعد ما يلقى أول كود
        html5QrCode.stop().catch(err => console.log("خطأ في إيقاف السكانر", err));
    };

    // 3. إعدادات الكاميرا
    const config = { 
        fps: 10, // شحال من صورة في الثانية
        qrbox: { width: 250, height: 250 } // حجم مربع السكانر لي يظهر
    };

    // 4. تشغيل الكاميرا
    // نقولولو استعمل الكاميرا الخلفية "environment"
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch(err => {
            // هادي تصرى إذا المستعمل ما عطاكش الإذن للكاميرا
            console.log("المستعمل رفض الكاميرا أو كاين خطأ: " + err);
            alert("لازم تسمح للكاميرا باش يخدم السكانر!");
        });

});
