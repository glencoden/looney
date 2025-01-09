import { api } from '@repo/api/client'
import { useEffectEvent } from '@repo/utils/hooks'
import { StripeEmbeddedCheckout } from '@stripe/stripe-js'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import getStripe from '~/helpers/get-stripe'

export default function Tip() {
    const [embeddedCheckout, setEmbeddedCheckout] =
        useState<StripeEmbeddedCheckout | null>(null)

    const createCheckoutSession = api.stripe.createCheckoutSession.useMutation()

    const fetchClientSecret = async () => {
        const { clientSecret } = await createCheckoutSession.mutateAsync()

        return z.string().parse(clientSecret)
    }

    const mountCheckoutForm = useEffectEvent(async () => {
        const stripe = await getStripe()

        if (stripe === null) {
            throw new Error('Stripe is not loaded')
        }

        const checkout = await stripe.initEmbeddedCheckout({
            fetchClientSecret,
        })

        checkout.mount('#checkout')

        setEmbeddedCheckout(checkout)
    })

    const isMountInitRef = useRef(false)

    useEffect(() => {
        if (isMountInitRef.current) {
            return
        }

        isMountInitRef.current = true

        void mountCheckoutForm()
    }, [mountCheckoutForm])

    const unmountCheckoutForm = useEffectEvent(() => {
        if (embeddedCheckout === null) {
            return
        }
        try {
            embeddedCheckout.unmount()
        } catch (err) {
            console.error(err)
        }
        embeddedCheckout.destroy()
    })

    useEffect(() => {
        return unmountCheckoutForm
    }, [unmountCheckoutForm])

    return <div id='checkout' className='max-h-[60dvh] overflow-scroll' />
}
