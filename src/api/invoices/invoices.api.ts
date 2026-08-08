import api from "../api.config";
import { createCrudApi } from "../api.utils";
import { CreateInvoiceRequest, Invoice, PageParams, PageResponse } from "@/lib/configs/interface";

export const invoicesApi = {
  ...createCrudApi<Invoice, CreateInvoiceRequest, CreateInvoiceRequest>("/invoices"),

  getAllPaginated: async (params: PageParams): Promise<PageResponse<Invoice>> => {
    const response = await api.get<PageResponse<Invoice>>("/invoices", { params });
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}/status`, null, { params: { status } });
    return response.data;
  },

  registerPayment: async (id: number, data: { paidAt: string; paymentMethod: string }): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/${id}/payments`, data);
    return response.data;
  },

  createFromQuote: async (quoteId: number): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/from-quote/${quoteId}`);
    return response.data;
  },

  sendEmail: async (id: number): Promise<void> => {
    await api.post(`/invoices/${id}/send-email`);
  }
};
