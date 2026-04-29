import assert from 'assert'
import Stripe from 'stripe'
import { publicProcedure } from '../../index.js'

let _stripe: Stripe | null = null
const getStripeConfig = () => {
    const HOST = process.env.HOST_SING
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
    const TIP_STRIPE_PRICE = process.env.TIP_STRIPE_PRICE

    assert(HOST, 'Expect HOST to be set.')
    assert(STRIPE_SECRET_KEY, 'Expect STRIPE_SECRET_KEY to be set.')
    assert(TIP_STRIPE_PRICE, 'Expect TIP_STRIPE_PRICE to be set.')

    _stripe ??= new Stripe(STRIPE_SECRET_KEY)
    return { stripe: _stripe, HOST, TIP_STRIPE_PRICE }
}

export const stripeRouter = {
    createCheckoutSession: publicProcedure.mutation(async () => {
        const { stripe, HOST, TIP_STRIPE_PRICE } = getStripeConfig()
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded_page',
            line_items: [
                {
                    price: TIP_STRIPE_PRICE,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${HOST}/tip/return?session_id={CHECKOUT_SESSION_ID}`,
        })

        return { clientSecret: session.client_secret }
    }),
}
