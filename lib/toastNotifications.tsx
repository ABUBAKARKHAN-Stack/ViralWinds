import { toast } from "sonner";

const successToast = (message: string) => {
  const isDark = document.documentElement.classList.contains("dark");
  toast.success(message, {
    style: {
      backgroundColor: isDark ? "#166534" : "#BBF7D0",
      color: isDark ? "#E6F4EA" : "#065F46",
      border: "1px solid #16A34A",
      height: "auto",
      borderRadius: "8px",
      padding: "4px 16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontSize: "12px",
    },
    duration: 2000,
    position: "top-center",
  });
};

const errorToast = (message: string) => {
  const isDark = document.documentElement.classList.contains("dark");
  toast.error(message, {
    style: {
      backgroundColor: isDark ? "#2C2222" : "#FFF5F5",
      color: isDark ? "#F93A37" : "#F9504E",
      border: isDark ? "1px solid #472625" : "1px solid #FEDAD9",
      height: "auto",
      borderRadius: "8px",
      padding: "4px 16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontSize: "12px",
      width: "fit-content",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    duration: 2000,
    position: "top-center",
  });
};

const infoToast = (message: string) => {
  const isDark = document.documentElement.classList.contains("dark");

  toast.info(message, {
    className: `rounded-md shadow-md ${
      isDark
        ? "dark:bg-[#4A5568] dark:text-white dark:border-[#6B7280]"
        : "bg-[#E6E8F0] text-[#2D3748] border-[#A0AEC0]"
    }`,
    style: {
      backgroundColor: isDark ? "#4A5568" : "#E6E8F0", // Dark Gray for Dark Mode, Light Gray for Light Mode
      color: isDark ? "#FFFFFF" : "#2D3748", // White text in Dark Mode, Dark Gray text in Light Mode
      border: isDark ? "1px solid #6B7280" : "1px solid #A0AEC0", // Darker Gray border in Dark Mode, Lighter Gray border in Light Mode
      height: "auto", // Allow dynamic height based on content
      borderRadius: "8px", // Rounded corners to match ShopNex UI
      padding: "4px 16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
      fontSize: "12px", // Consistent font size with other toasts and UI
    },
    duration: 2000, // Duration in milliseconds (2 seconds, matching your error/success toasts)
    position: "top-center", // Centered at the top for prominence, as requested
  });
};

export { successToast, errorToast, infoToast };
