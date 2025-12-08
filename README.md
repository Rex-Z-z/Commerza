# Commerza

Commerza is a modern, comprehensive e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. It features a dual-interface system supporting both public marketplace browsing and a dedicated dashboard for buyers and suppliers.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Tables:** [TanStack Table](https://tanstack.com/table/v8)
- **Carousel:** [Embla Carousel](https://www.embla-carousel.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## ✨ Key Features

### 🛍️ Marketplace
- **Dynamic Home Page:** Features Main, Flash Sale, and Best Sale carousels with a sticky search bar.
- **Advanced Search & Filtering:** - Price and Discount range sliders.
  - Multi-select checkbox filters for Brands, Features, and Categories.
  - Rating filters.
- **Interactive Navigation:** Mega-menus for categories and marketplace sections.

### 🏢 User & Supplier Dashboard
- **Product Management:** Data tables for viewing, sorting, and managing product status (Active, Inactive, Suspended).
- **Order Management:** Detailed order history with status tracking and payment method visualization.
- **Supplier Verification:** - **Company Verification:** Form for uploading business licenses and tax information.
  - **Identity Verification:** KYC flow for individual sellers with ID and selfie upload simulation.
- **Profile Management:** Editable user profile settings.

### 🔐 Authentication
- **Secure Access:** Dedicated Login and Sign-up pages for Users and Companies.
- **Account Verification:** Email OTP (One-Time Password) verification flow.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rex-z-z/commerza.git](https://github.com/rex-z-z/commerza.git)
   cd commerza