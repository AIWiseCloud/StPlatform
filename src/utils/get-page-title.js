import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Element Admin7777'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
