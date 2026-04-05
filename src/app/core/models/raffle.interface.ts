export interface Raffle {
  id?: number;
  name: string;
  description?: string;
  prize_description?: string;
  type?: string;
  ticket_price: string | number;
  number_from: number;
  number_to: number;
  draw_at: string;
  status?: string;
  winner_ticket?: string; // Adjust based on your API if Laravel sends this natively
  image_path?: string;
  created_at?: string;
  updated_at?: string;
}
