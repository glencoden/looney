import { Link, NavLink, Outlet, useLoaderData, useLocation } from 'react-router'
import { getSetlists } from '@repo/db/queries'
import BoxHorizontalPagination from '@repo/ui/components/BoxHorizontalPagination'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'

export const loader = async () => {
    const setlists = await getSetlists()

    return { setlists }
}

export default function Setlists() {
    const { setlists } = useLoaderData<typeof loader>()

    const location = useLocation()

    return (
        <BoxMain>
            <BoxHorizontalPagination isLeft={location.pathname === '/setlists'}>
                <section className='max-w-96 flex-grow max-lg:w-full'>
                    <Button
                        asChild
                        className='float-start'
                        variant='ghost'
                        size='icon'
                    >
                        <Link to='/'>
                            <ArrowLeft className='h-6 w-6 text-white' />
                        </Link>
                    </Button>

                    <H2>Setlists</H2>

                    <Button asChild className='mt-8'>
                        <Link to='/setlists/create'>New</Link>
                    </Button>

                    <ul className='mt-8 space-y-2'>
                        {setlists.map(({ id, title, updatedAt }) => (
                            <li key={id}>
                                <NavLink
                                    to={`/setlists/${id}`}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex justify-between hover:underline',
                                            {
                                                underline: isActive,
                                            },
                                        )
                                    }
                                >
                                    <Body2>{title}</Body2>
                                    {updatedAt && (
                                        <Body1>
                                            &nbsp;
                                            {format(
                                                new Date(updatedAt),
                                                'MMM d, yyyy',
                                            )}
                                        </Body1>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>

                <Outlet />
            </BoxHorizontalPagination>
        </BoxMain>
    )
}
