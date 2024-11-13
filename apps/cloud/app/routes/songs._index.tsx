import BoxFullHeight from '@repo/ui/components/BoxFullHeight'
import H3 from '@repo/ui/typography/H3'

export default function SongsIndex() {
    return (
        <BoxFullHeight>
            <div className='flex flex-col items-center justify-center'>
                <H3 className='text-blue-300'>Select a song</H3>
            </div>
        </BoxFullHeight>
    )
}
