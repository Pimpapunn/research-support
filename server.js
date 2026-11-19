const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ALT_PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve all static files (index.html, grants.html, css/, js/, data_research/)
app.use(express.static(__dirname));

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/grants', (req, res) => {
    res.sendFile(path.join(__dirname, 'grants.html'));
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rais.soc.pim@gmail.com',
                pass: 'ndwmafzqxugvwzae'
            }
        });

        await transporter.sendMail({
            from: 'rais.soc.pim@gmail.com',
            to: 'rais.soc.pim@gmail.com',
            subject: `ติดต่อจาก ${name}`,
            html: `
                <h3>ข้อมูลผู้ติดต่อ</h3>
                <p><b>ชื่อ:</b> ${name}</p>
                <p><b>อีเมล:</b> ${email}</p>
                <p><b>ข้อความ:</b></p>
                <p>${message}</p>
            `
        });

        res.json({
            success: true
        });

    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Primary server on PORT 3000
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Web Server running at: http://localhost:${PORT}`);
    console.log(` - Main Page:   http://localhost:${PORT}/`);
    console.log(` - Grants Page: http://localhost:${PORT}/grants.html`);
    console.log(` - Contact API: http://localhost:${PORT}/api/contact`);
    console.log(`===============================================`);
});

// Also listen on 3001 as fallback
if (Number(PORT) !== Number(ALT_PORT)) {
    app.listen(ALT_PORT, () => {
        console.log(` Alternate listener active on http://localhost:${ALT_PORT}`);
    }).on('error', (err) => {
        console.log(` Note: Port ${ALT_PORT} optional listener not bound (${err.code || err.message})`);
    });
}