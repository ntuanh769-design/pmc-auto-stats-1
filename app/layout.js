import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Cấu hình font Be Vietnam Pro từ Google (Chuẩn Next.js)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"], // Nạp bộ ký tự Tiếng Việt
  weight: ["300", "400", "500", "600", "700", "900"], // Nạp đủ độ đậm nhạt
  variable: "--font-be-vietnam", // Tạo biến CSS để Tailwind dùng
  display: 'swap',
});

export const metadata = {
  title: "Phương Mỹ Chi | Official Fan Hub",
  description: "Cổng thông tin chính thức của nghệ sĩ Phương Mỹ Chi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}