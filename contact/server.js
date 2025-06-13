require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Optional: if serving frontend

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "longh2867@gmail.com",
    pass: process.env.GMAIL_PASS || "gfydyemmkalriysh",
  },
});

app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email gửi cho Admin
  const mailToAdmin = {
    from: `"${name}" <${email}>`,
    to: "longh2867@gmail.com", // Admin nhận
    subject: `📬 Liên hệ mới: ${subject}`,
    text: `Tên: ${name}\nEmail: ${email}\nNội dung: ${message}`,
    html: `
      <h3>📩 Có người vừa liên hệ</h3>
      <p><strong>Tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Chủ đề:</strong> ${subject}</p>
      <p><strong>Nội dung:</strong></p>
      <blockquote>${message}</blockquote>
    `,
  };

  // Email phản hồi cho người dùng
  const mailToUser = {
    from: `"Your Company" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Cảm ơn bạn đã liên hệ: ${subject}`,
    text: `Chào ${name},\n\nChúng tôi đã nhận được tin nhắn của bạn:\n"${message}"\n\nNếu bạn cần trao đổi hoặc hợp tác, vui lòng liên hệ qua các kênh bên dưới.\n\nEmail: longh2867@gmail.com\nĐiện thoại: 0394459156\nWebsite: nguyentienhoanglong.com\n\nFacebook: [Link Facebook]\nLinkedIn: [Link LinkedIn]\nInstagram: [Link Instagram]\n\nTrân trọng,\nYour Company`,
    html: `
    <h3>Xin chào ${name},</h3>
    <p>Chúng tôi đã nhận được tin nhắn của bạn với nội dung:</p>
    <blockquote>${message}</blockquote>

    Xin chào! Nếu bạn cần trao đổi hoặc hợp tác, vui lòng liên hệ tôi qua các kênh dưới đây. Tôi luôn sẵn sàng hỗ trợ.</p>

    <p><strong>Thông tin liên hệ:</strong><br>
    📧 Email: <a href="mailto:longh2867@gmail.com">longh2867@gmail.com</a><br>
    📞 Số điện thoại: <a href="tel:0394459156">0394459156</a><br>
    🌐 Website: <a href="https://nguyentienhoanglong.com" target="_blank">nguyentienhoanglong.com</a><br>
    📍 Địa chỉ: Thủ Đức, Thành phố Hồ Chí Minh</p>

    <p><strong>Mạng xã hội:</strong><br>
    🔗 Facebook: <a href="[Link Facebook]" target="_blank">[Link Facebook]</a><br>
    🔗 LinkedIn: <a href="[Link LinkedIn]" target="_blank">[Link LinkedIn]</a><br>
    🔗 Instagram: <a href="[Link Instagram]" target="_blank">[Link Instagram]</a></p>

    <p><strong>Lời cảm ơn:</strong><br>
    Cảm ơn bạn đã dành thời gian liên hệ với tôi!<br>
    Tôi trân trọng mọi sự kết nối và cơ hội làm việc cùng nhau.<br>
    Hãy gửi tin nhắn, tôi sẽ phản hồi sớm nhất có thể.</p>

    <p>Trân trọng,<br><strong>About Me</strong></p>
  `,
  };

  try {
    // Gửi cả hai email song song
    await Promise.all([
      transporter.sendMail(mailToAdmin),
      transporter.sendMail(mailToUser),
    ]);

    res.status(200).json({ message: "Email đã được gửi thành công" });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res
      .status(500)
      .json({ error: "Gửi email thất bại", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
