import { VerticalSpacer } from './VerticalSpacer'

const logos = [
    'vice.png',
    'levis.png',
    'mc-fit.png',
    'hilti.png',
    'boston-consulting.png',
    'soho.png',
    'benz.png',
    'normec.png',
    'spreespeicher.png',
    'bikini.png',
    'berlin.png',
    'nhow.png',
    'byron.png',
    'digital-turbine.png',
    'edelweiss.png',
    'katapult.png',
    'icke.jpg',
    'oooh.png',
    'ronsons.png',
    'CT.png',
    'valora.png',
    'VO.png',
    'welldo.png',
]

const animations = ['slide-top', 'slide-bottom', 'slide-left', 'slide-right']
const numColumns = 4
const spice = 'ライブ❤カラオケ!'

const logosList = [...logos]

for (let i = 0; i < spice.length; i++) {
    const currentIndex = numColumns * i + Math.floor(Math.random() * numColumns)
    if (currentIndex >= logosList.length) {
        break
    }
    logosList.splice(currentIndex, 0, `${spice[i]}${i}`)
}

export function ReferencesPage() {
    const getRandomAnimation = () => animations[Math.floor(Math.random() * 4)]

    return (
        <>
            <VerticalSpacer />

            <div className="logos">
                {logosList.map((logo) => {
                    if (logo.length === 2) {
                        return (
                            <div
                                key={logo}
                                className={`logo-box-salt ${getRandomAnimation()}`}
                            >
                                {logo.slice(0, 1)}
                            </div>
                        )
                    } else {
                        return (
                            <div key={logo} className={`logo-box ${getRandomAnimation()}`}>
                                <img src={`/images/${logo}`} alt={`reference ${logo}`} />
                            </div>
                        )
                    }
                })}
            </div>

            <VerticalSpacer />
        </>
    )
}
