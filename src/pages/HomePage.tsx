import { projects } from '../data/portfolio'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { SummerCover } from '../components/summer/SummerCover'
import { NoonaFeature } from '../components/summer/NoonaFeature'
import { SummerSectionIndex } from '../components/summer/SummerSectionIndex'
import { SummerContact } from '../components/summer/SummerContact'

export function HomePage() {
  usePageMetadata('Theerada Siri', 'The technical portfolio of Theerada Siri: software, cloud infrastructure, networks, and competitive programming. Built on curiosity. Best enjoyed warm.')
  const feature = projects.find(project => project.slug === 'noona-appointment')
  return <>
    <div id="about"><SummerCover /></div>
    {feature && <div id="work"><NoonaFeature project={feature} /></div>}
    <SummerSectionIndex />
    <SummerContact />
  </>
}
