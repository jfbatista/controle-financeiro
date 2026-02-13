const nodemailer = require('nodemailer');

const config = {
    host: 'financeiro.jdiweb.com.br',
    port: 465,
    secure: true,
    auth: {
        user: 'contato@financeiro.jdiweb.com.br',
        pass: 'JU24cl22smtp',
    },
};

console.log('Testing SMTP with password: JU24cl22smtp\n');
console.log('Config:', { host: config.host, port: config.port, secure: config.secure, user: config.auth.user });

const transporter = nodemailer.createTransport(config);

transporter.sendMail({
    from: 'contato@financeiro.jdiweb.com.br',
    to: 'jfbatista@hotmail.com',
    subject: 'Teste SMTP - Fluxo de Caixa',
    text: 'Email de teste do sistema Fluxo de Caixa.',
    html: '<p>Este é um <strong>email de teste</strong> do sistema Fluxo de Caixa.</p><p>Se você recebeu este email, o SMTP está funcionando corretamente! ✅</p>',
}, (err, info) => {
    if (err) {
        console.error('\n❌ FAILED:', err.message);
        console.error('Error code:', err.code);
        process.exit(1);
    } else {
        console.log('\n✅ SUCCESS! Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        process.exit(0);
    }
});
