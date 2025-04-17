import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "Date inconnue";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
};