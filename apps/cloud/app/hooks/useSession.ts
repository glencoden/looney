import { useQuery } from '@tanstack/react-query'
import { supabase } from '~/lib/supabase.client'

export const useSession = () => {
    return useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const { data } = await supabase.auth.getSession()
            return data?.session
        },
    })
}
