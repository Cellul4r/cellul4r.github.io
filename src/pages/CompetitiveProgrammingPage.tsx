import { CompetitiveProgrammingOverview } from '../features/competitive-programming/overview/CompetitiveProgrammingOverview'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CompetitiveProgrammingPage() {
  useDocumentTitle('Competitive Programming')
  return <CompetitiveProgrammingOverview />
}
