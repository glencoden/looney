import { cn } from '../helpers'

export default function Spinner({ light }: Readonly<{ light?: boolean }>) {
    return (
        <span>
            <span
                className={cn(
                    'animate-spinner1 absolute h-[6px] w-[2px] origin-top -translate-y-[3.5px] translate-x-[3.5px] -rotate-[135deg] transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner2 absolute h-[6px] w-[2px] origin-top translate-x-[5px] -rotate-90 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner3 absolute h-[6px] w-[2px] origin-top translate-x-[3.5px] translate-y-[3.5px] -rotate-45 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner4 absolute h-[6px] w-[2px] origin-top translate-y-[5px] rotate-0 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner5 absolute h-[6px] w-[2px] origin-top -translate-x-[3.5px] translate-y-[3.5px] rotate-45 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner6 absolute h-[6px] w-[2px] origin-top -translate-x-[5px] rotate-90 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner7 absolute h-[6px] w-[2px] origin-top -translate-x-[3.5px] -translate-y-[3.5px] rotate-[135deg] transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
            <span
                className={cn(
                    'animate-spinner8 absolute h-[6px] w-[2px] origin-top -translate-y-[5px] rotate-180 transform rounded-[2px] bg-slate-800',
                    {
                        'bg-white': light,
                    },
                )}
            />
        </span>
    )
}
