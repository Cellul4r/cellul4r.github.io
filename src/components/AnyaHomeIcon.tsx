import friendlyFace from '../assets/anya-nav-friendly.png'
import goofyFace from '../assets/anya-nav-goofy.png'

export function AnyaHomeIcon() {
  return (
    <span className="anya-home-icon" aria-hidden="true">
      <img className="anya-face-normal" src={friendlyFace} width={44} height={44} alt="" />
      <img className="anya-face-goofy" src={goofyFace} width={44} height={44} alt="" />
    </span>
  )
}
