'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { resolveHref } from '@/sanity/lib/utils'
import type {
  ArtistPayload,
  CollectionPayload,
  MenuItem,
  SettingsPayload,
} from '@/types'
import { useState } from 'react'
import Image from 'next/image'
import artistsImage from '/public/images/blobs/artists.svg'
import collectionsImage from '/public/images/blobs/collectionsTris.svg'
import { usePathname } from 'next/navigation'

interface NavbarLayoutProps {
  data: SettingsPayload
  artists: ArtistPayload[]
  collections: CollectionPayload[]
}

export default function NavbarLayout({
  data,
  artists,
  collections,
}: NavbarLayoutProps) {
  const pathname = usePathname()

  const menuItems = data?.menuItems || ([] as MenuItem[])
  const borderColors = ['#C6F042', '#FF4517', '#B798DF', '#FE2B97', '#000']
  const grayColor = 'rgba(255, 255, 255, 0.25)'
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getBackgroundColor = (menuItem) => {
    switch (menuItem) {
      case 'Artists':
        return '#C6F042'
      case 'Blog':
        return '#CC96FF'
      case 'Collections':
        return '#FF4517'
      case 'Merch':
        return '#d28a04'
      default:
        return 'transparent'
    }
  }

  const handleMouseEnter = (menuItem) => {
    setHoveredItem(menuItem)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const dropdownItem = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  }

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { delay: 0.2, duration: 0.4 } },
  }

  // const backgroundVariants = {
  //   hidden: { opacity: 0, y: '-100%' },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { ease: [0.76, 0, 0.24, 1] },
  //   },
  //   exit: {
  //     y: '-100%',
  //     transition: { delay: 0.1, duration: 1, ease: [0.76, 0, 0.24, 1] },
  //   },
  // }

  const shouldColorBorder = (menuItem) => {
    if (pathname === '/' || pathname === '/info') {
      return true
    }
    return pathname.includes(menuItem.toLowerCase())
  }

  return (
    <>
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className="absolute inset-0 z-20 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backgroundVariants}
            transition={{ duration: 0.1 }}
            style={{ backgroundColor: getBackgroundColor(hoveredItem) }}
          >
            {hoveredItem === 'Artists' && (
              <Image
                className="z-50 absolute left-1/3 md:right-0 bottom-16 md:top-0 w-[100vw] md:w-[70vw]"
                src={artistsImage}
                alt={'Artists Image'}
                width={2500} // Adjust the width as needed
                height={2500} // Adjust the height as needed
              />
            )}
            {hoveredItem === 'Collections' && (
              <Image
                className="z-50 absolute right-[13vw] md:left-32 bottom-16 md:bottom-0 w-[80vw] md:w-[55vw] -rotate-12"
                src={collectionsImage}
                alt={'Collections Image'}
                width={2500} // Adjust the width as needed
                height={2500} // Adjust the height as needed
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 w-full z-50 flex flex-wrap items-center justify-between gap-x-0 px-4 md:px-16 lg:px-32 text-black tracking-tighter">
        {menuItems &&
          menuItems.slice(0, 2).map((menuItem, key) => {
            const href = resolveHref(menuItem?._type, menuItem?.slug)
            if (!href) {
              return null
            }

            const borderColor =
              hoveredItem === menuItem.title
                ? 'transparent'
                : shouldColorBorder(menuItem.title)
                  ? borderColors[key % borderColors.length]
                  : grayColor
            const textColor = shouldColorBorder(menuItem.title)
              ? 'black'
              : grayColor

            return (
              <>
                <div
                  key={key}
                  className="relative px-0 pb-2"
                  onMouseEnter={() => handleMouseEnter(menuItem.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span
                    className={`uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl cursor-pointer`}
                  >
                    <div
                      className={`h-2 w-full z-20 relative uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl`}
                      style={{ backgroundColor: `${borderColor}` }}
                    ></div>
                    <div className="z-10" style={{ color: textColor }}>
                      {menuItem.title}
                    </div>
                  </span>
                  <AnimatePresence>
                    {menuItem.title === 'Artists' &&
                      hoveredItem === 'Artists' && (
                        <div className="absolute left-0 ml-3 md:ml-6 uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl min-w-max">
                          {artists.map((artist, index) => {
                            const artistHref = resolveHref(
                              artist._type,
                              artist.slug,
                            )
                            if (!artistHref) {
                              return null
                            }
                            return (
                              <motion.div
                                key={index}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={dropdownItem}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.76, 0, 0.24, 1],
                                  delay: index * 0.07,
                                }}
                              >
                                <Link
                                  href={artistHref}
                                  className="block text-black hover:text-[#fff]"
                                >
                                  {artist.name}
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {menuItem.title === 'Collections' &&
                      hoveredItem === 'Collections' && (
                        <div className="absolute left-0 ml-3 md:ml-6 uppercase tracking-tighter text-lg font-extrabold hover:text-black md:text-2xl w-full">
                          {collections.map((collection, index) => {
                            const collectionHref = resolveHref(
                              collection._type,
                              collection.slug,
                            )
                            if (!collectionHref) {
                              return null
                            }
                            return (
                              <motion.div
                                key={index}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={dropdownItem}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.76, 0, 0.24, 1],
                                  // delay: index * 0.2,
                                  delay: index * 0.07,
                                }}
                              >
                                <Link
                                  key={index}
                                  href={collectionHref}
                                  className="block text-black hover:text-[#fff]"
                                >
                                  {collection.title}
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                  </AnimatePresence>
                </div>
              </>
            )
          })}

        <div className="fixed bottom-0 left-0 w-full z-10 flex flex-wrap items-center justify-between gap-x-0 px-4 md:px-16 lg:px-32 text-black tracking-tighter">
          {menuItems &&
            menuItems.slice(2).map((menuItem, key) => {
              const href = resolveHref(menuItem?._type, menuItem?.slug)
              if (!href) {
                return null
              }

              const borderColor =
                hoveredItem === menuItem.title
                  ? 'transparent'
                  : shouldColorBorder(menuItem.title)
                    ? borderColors[(key + 2) % borderColors.length]
                    : grayColor
              const textColor = shouldColorBorder(menuItem.title)
                ? 'black'
                : grayColor

              return (
                <Link
                  key={key + 2}
                  className={`uppercase text-lg font-extrabold tracking-tighter border-b-8 border-[${borderColor}] hover:text-black md:text-2xl`}
                  href={href}
                  style={{
                    borderBottom: `8px solid ${borderColor}`,
                    color: textColor,
                  }}
                >
                  <div
                    className="z-10"
                    key={key}
                    onMouseEnter={() => handleMouseEnter(menuItem.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {menuItem.title}
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </>
  )
}
