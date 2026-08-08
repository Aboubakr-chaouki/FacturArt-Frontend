import api from "../api.config";
import { createCrudApi } from "../api.utils";
import { CreateQuoteRequest, Quote } from "../../lib/configs/interface/quote";
import { PageParams, PageResponse } from "../../lib/configs/interface/common";

export const quotesApi = {
  ...createCrudApi<Quote, CreateQuoteRequest, CreateQuoteRequest>("/quotes"),
  getAllPaginated: async (params: PageParams): Promise<PageResponse<Quote>> => {
    const response = await api.get<PageResponse<Quote>>("/quotes", { params });
    return response.data;
  },
};
