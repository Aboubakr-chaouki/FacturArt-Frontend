import { createCrudApi } from "../api.utils";
import { CreateQuoteRequest, Quote } from "../../lib/configs/interface/quote";

export const quotesApi = {
  ...createCrudApi<Quote, CreateQuoteRequest, CreateQuoteRequest>("/quotes"),
};
