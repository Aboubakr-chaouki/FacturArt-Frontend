import { User } from "@/lib/configs/interface/user";
import api from "@/api/api.config";

export const usersApi = {
    getMe: async (): Promise<User> => {
        const response = await api.get("/users/me");
        return response.data;
    },

    updateProfile: async (userData: Partial<User>, logoFile?: File): Promise<User> => {
        const formData = new FormData();
        formData.append("userData", new Blob([JSON.stringify(userData)], { type: "application/json" }));
        if (logoFile) {
            formData.append("logoFile", logoFile);
        }

        const response = await api.put("/users/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteMe: async (): Promise<void> => {
        await api.delete("/users/me");
    },

    downloadArchive: async (): Promise<Blob> => {
        const response = await api.get("/users/me/archive", {
            responseType: "blob",
        });
        return response.data;
    },
};
