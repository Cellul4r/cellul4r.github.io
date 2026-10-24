import anyaWinter from '../../../../assets/anya-codeforces-winter.webp'
import { SeasonalFoliage } from '../../../../components/decorations/SeasonalFoliage'
import styles from '../CodeforcesProfile.module.css'

export function CodeforcesMascot() {
  return <div className={styles.mascotStage} aria-hidden="true">
    <img src={anyaWinter} alt="" width={480} height={720} decoding="async" draggable={false} />
    <span className={styles.mascotSparkle} />
    <SeasonalFoliage variant="sprig" className={styles.mascotSprig} />
  </div>
}
