export interface ICreateQuoteRequestDto {
  shippingAddress?: unknown;
  billingAddress?: unknown;
  specialInstructions?: string;
  expectedLeadTime?: string;
}

export interface IQuoteItemRequest {
  id: string;
  quote_id: string;
  item_id: string;
  process: string;
  sub_process: string;
  material: string;
  material_grade: string;
  surface_finish: string;
  color: string;
  tolerance: string;
  target_cost: number;
  quantity: number;
  additional_details: unknown;
  last_updated_at: string;
}
