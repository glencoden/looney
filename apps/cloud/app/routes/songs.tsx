import { json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { getSongs } from '@repo/db/queries'
import { cn } from '@repo/ui/helpers'

export const loader = async () => {
    const songs = await getSongs()
    return json({ songs })
}

export default function Songs() {
    const { songs } = useLoaderData<typeof loader>()

    return (
        <div className='px-main py-main container flex min-h-dvh border-2 border-amber-500'>
            <section>
                <h1>Songs</h1>

                <ul>
                    {songs.map(({ id, artist, title }) => (
                        <li key={id}>
                            <NavLink
                                to={`/songs/${id}`}
                                className={({ isActive, isPending }) =>
                                    cn({
                                        'font-bold': isActive,
                                        'text-gray-500': isPending,
                                    })
                                }
                            >
                                {artist} - {title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </section>

            <Outlet />
        </div>
    )
}
