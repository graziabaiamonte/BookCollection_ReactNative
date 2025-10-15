import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (username, email, password) => {
    console.log("🔵 REGISTER - Starting registration process");
    console.log("📤 REGISTER - Data to send:", {
      username,
      email,
      password: "***",
    });
    console.log("🌐 REGISTER - API URL:", `${API_URL}/auth/register`);

    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      console.log("📥 REGISTER - Response status:", response.status);
      console.log("📥 REGISTER - Response ok:", response.ok);

      const data = await response.json();
      console.log("📥 REGISTER - Response data:", data);

      if (!response.ok) {
        console.log("❌ REGISTER - Request failed:", data.message);
        throw new Error(data.message || "Something went wrong");
      }

      console.log("💾 REGISTER - Saving to AsyncStorage...");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      console.log("✅ REGISTER - Saved to AsyncStorage");

      set({ token: data.token, user: data.user, isLoading: false });
      console.log("✅ REGISTER - Registration successful");

      return { success: true };
    } catch (error) {
      console.log("❌ REGISTER - Error:", error.message);
      console.log("❌ REGISTER - Full error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    console.log("🔵 LOGIN - Starting login process");
    console.log("📤 LOGIN - Data to send:", { email, password: "***" });
    console.log("🌐 LOGIN - API URL:", `${API_URL}/auth/login`);

    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("📥 LOGIN - Response status:", response.status);
      console.log("📥 LOGIN - Response ok:", response.ok);

      const data = await response.json();
      console.log("📥 LOGIN - Response data:", data);

      if (!response.ok) {
        console.log("❌ LOGIN - Request failed:", data.message);
        throw new Error(data.message || "Something went wrong");
      }

      console.log("💾 LOGIN - Saving to AsyncStorage...");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      console.log("✅ LOGIN - Saved to AsyncStorage");

      set({ token: data.token, user: data.user, isLoading: false });
      console.log("✅ LOGIN - Login successful");

      return { success: true };
    } catch (error) {
      console.log("❌ LOGIN - Error:", error.message);
      console.log("❌ LOGIN - Full error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    console.log("🔵 CHECK_AUTH - Checking authentication");

    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      console.log(
        "📥 CHECK_AUTH - Token from storage:",
        token ? "exists" : "null"
      );
      console.log("📥 CHECK_AUTH - User from storage:", user);

      set({ token, user });
      console.log("✅ CHECK_AUTH - Auth check completed");
    } catch (error) {
      console.log("❌ CHECK_AUTH - Auth check failed:", error);
      console.log("❌ CHECK_AUTH - Full error:", error);
    } finally {
      set({ isCheckingAuth: false });
      console.log("🔵 CHECK_AUTH - isCheckingAuth set to false");
    }
  },

  logout: async () => {
    console.log("🔵 LOGOUT - Starting logout process");

    try {
      await AsyncStorage.removeItem("token");
      console.log("✅ LOGOUT - Token removed from AsyncStorage");

      await AsyncStorage.removeItem("user");
      console.log("✅ LOGOUT - User removed from AsyncStorage");

      set({ token: null, user: null });
      console.log("✅ LOGOUT - State cleared");
      console.log("✅ LOGOUT - Logout successful");
    } catch (error) {
      console.log("❌ LOGOUT - Error during logout:", error);
    }
  },
}));
