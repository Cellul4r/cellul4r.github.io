import anya from '../../../../assets/anya-nav-friendly.png'
import styles from '../CodeforcesProfile.module.css'

export function CodeforcesMascot() {
  return <div className={styles.mascotStage} aria-hidden="true">
    <img src={anya} alt="" width={60} height={60} decoding="async" draggable={false} />
    <span className={styles.mascotSparkle} />
  </div>
}
