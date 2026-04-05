export interface RaffleStats {
  raffle_id?: number;
  raffle_name?: string;
  status?: string;
  draw_at?: string;
  tickets_total: number;
  tickets_sold: number;
  tickets_reserved: number;
  tickets_available: number;
  percentage_sold: number;
  revenue_total: number;
  revenue_goal: number;
  percentage_revenue: number;
}
