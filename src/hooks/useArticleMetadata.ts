import { usePageMetadata } from './usePageMetadata'
export function useArticleMetadata(title: string, description: string) {
  usePageMetadata(`${title} | Theerada Siri`, description)
}
