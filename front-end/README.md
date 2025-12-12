# Phegon Bank - Frontend

Dự án React + Vite với TypeScript, TailwindCSS, Axios và React Router được thiết lập theo cấu trúc chuẩn production.

## 🚀 Công nghệ sử dụng

- **React 19** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **TailwindCSS** - CSS Framework
- **Axios** - HTTP Client
- **React Router DOM** - Routing

## 📁 Cấu trúc dự án

```
src/
├── assets/              # Ảnh, icon, font
├── components/          # Component tái sử dụng (.tsx)
├── layouts/             # Layout chính (MainLayout, AuthLayout...)
├── pages/               # Các trang (Home, Login, Dashboard)
├── routes/              # Định nghĩa route
├── hooks/               # Custom hook (useAuth, useFetch...)
├── services/            # Logic kết nối API (axios instance)
├── store/               # State management (Zustand / Redux / Context)
├── types/               # TypeScript type definitions
├── utils/               # Helper, formatter, validate...
└── styles/              # CSS global (nếu có)
```

## 🛠️ Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Quy ước đặt tên

- **Component**: PascalCase với `.tsx` (ví dụ: `Button.tsx`, `LoginForm.tsx`)
- **Folder**: lowercase (ví dụ: `services/`, `utils/`)
- **API**: Tách theo module với `.ts` (ví dụ: `auth.api.ts`, `user.api.ts`)
- **Page**: Tương ứng với route (ví dụ: `/login` → `pages/Login.tsx`)
- **Types**: Định nghĩa types trong `types/` (ví dụ: `api.types.ts`)

## 🎯 Tính năng đã thiết lập

- ✅ **TypeScript** với cấu hình đầy đủ và type safety
- ✅ TailwindCSS với cấu hình đầy đủ
- ✅ Axios instance với interceptors (token, error handling)
- ✅ React Router với layout system
- ✅ Cấu trúc folder chuẩn production
- ✅ Custom hooks mẫu với TypeScript (useAuth)
- ✅ Utils mẫu với type definitions (format, validate)
- ✅ API services mẫu với types (auth.api.ts, user.api.ts)
- ✅ Component mẫu với TypeScript (Button)
- ✅ Type definitions cho API requests/responses

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vite.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 📄 License

MIT
