import { createCrudApi } from '../api.utils';
import { Client } from '../../lib/configs/interface/client';
import { CreateClientFormData, UpdateClientFormData } from '../../lib/configs/schemas-zod/form/client.schema';

export const clientsApi = createCrudApi<Client, CreateClientFormData, UpdateClientFormData>('/clients');
