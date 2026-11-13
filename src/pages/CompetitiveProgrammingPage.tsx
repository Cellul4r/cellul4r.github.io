import { CompetitiveProgrammingOverview } from '../features/competitive-programming/overview/CompetitiveProgrammingOverview'
import { usePageMetadata } from '../hooks/usePageMetadata'

export function CompetitiveProgrammingPage() {
  usePageMetadata('Competitive Programming | Theerada Siri', 'ICPC achievements, algorithmic problem solving, and tutoring and TA activities by Theerada Siri.')
  return <CompetitiveProgrammingOverview />
}
