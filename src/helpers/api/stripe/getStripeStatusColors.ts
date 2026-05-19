import { app_colors } from "../../constants";

export const getStatusBackgroundColor = (status: string) => {
  switch(status) {
    case 'active':
      return { background: app_colors.green_eighty, foreground: app_colors.white };
    case 'past_due':
      return { background: app_colors.orange_eighty, foreground: app_colors.white };
    case 'succeeded':
      return { background: app_colors.green_eighty, foreground: app_colors.white };
    case 'failed':
      return { background: app_colors.red_eighty, foreground: app_colors.white };
    case 'inactive':
      return { background: app_colors.white_twenty, foreground: app_colors.white };
    case 'canceled':
      return { background: app_colors.red_eighty, foreground: app_colors.white };
    case 'requires_payment_method':
      return { background: app_colors.red_eighty, foreground: app_colors.white };
    default:
      return { background: app_colors.white_twenty, foreground: app_colors.white };
  }
}