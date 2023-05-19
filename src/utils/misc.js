import { getImage as gatsbyGetImage } from 'gatsby-plugin-image'
import { useState, useEffect } from 'react'
import cloneDeep from 'lodash.clonedeep'

export const getImage = image => gatsbyGetImage(image.localFile)

export const getDate = dateString => {
  const parts = dateString.split('/')
  return new Date(parts[2], parts[1], parts[0])
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.<br />
 * It also monitor the document changes to detect when it matches or stops matching the media query.<br />
 * Returns the validity state of the given media query.
 *
 */
/* eslint-disable */

export const useMediaQuery = mediaQuery => {
  if (typeof window === 'undefined') {
    console.warn('cannot server side render useMediaQuery')
    return null
  }
  const [isVerified, setIsVerified] = useState(
    !!window.matchMedia(mediaQuery).matches
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches)

    try {
      mediaQueryList.addEventListener('change', documentChangeHandler)
    } catch (e) {
      // Safari isn't supporting mediaQueryList.addEventListener
      mediaQueryList.addListener(documentChangeHandler)
    }

    documentChangeHandler()
    return () => {
      try {
        mediaQueryList.removeEventListener('change', documentChangeHandler)
      } catch (e) {
        // Safari isn't supporting mediaQueryList.removeEventListener
        mediaQueryList.removeListener(documentChangeHandler)
      }
    }
  }, [mediaQuery])

  return isVerified
}
/* eslint-enable */

export const getLinkProps = currentPagePath => menuItemNode => {
  if (menuItemNode.path === '#country-snapshots') {
    return {
      name: menuItemNode.label,
      to: '/',
      state: { skipToCountries: true },
    }
  } else {
    return {
      name: menuItemNode.label,
      to: menuItemNode.path,
      active: menuItemNode.path === currentPagePath,
    }
  }
}

export const convertToSlug = text => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export const stripTags = html => {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerText
  }
  return html
}

const addNodeToTree = (node, tree, processNode) => {
  const processedNode = processNode(node)
  if (node.id in tree) {
    processedNode.children = tree[node.id]
    if (node.parentId === null) {
      tree.root.unshift(processedNode)
    } else {
      if (!(node.parentId in tree)) {
        tree[node.parentId] = []
      }
      tree[node.parentId].unshift(processedNode)
    }
  } else if (node.parentId === null) {
    tree.root.unshift(processedNode)
  } else {
    if (!(node.parentId in tree)) {
      tree[node.parentId] = []
    }
    tree[node.parentId].unshift(processedNode)
  }
}

export const arrayToTree = (array, processNode) => {
  const tree = {
    root: [],
  }
  for (let i = array.length - 1; i >= 0; i--) {
    addNodeToTree(array[i], tree, processNode)
  }
  return tree.root
}

/**
 * Flattens a post's acf fields with its wordpress fields
 * E.g. converts
 * {
 *   title,
 *   date,
 *   post: {
 *     content
 *   }
 * }
 * into
 * {
 *   title,
 *   date,
 *   content
 * }
 */
export const combineFields = (data, acfFieldGroupNames) => {
  // Clone data so we don't delete anything from original object
  const clonedData = cloneDeep(data)
  const flattenedData = {}
  acfFieldGroupNames.forEach(acfFieldGroupName => {
    // Copy the acf fields to the new object
    Object.assign(flattenedData, clonedData[acfFieldGroupName])
    // Delete the acf fields from the old object
    delete clonedData[acfFieldGroupName]
  })
  // Copy the wordpress fields to the new object
  Object.assign(flattenedData, clonedData)
  return flattenedData
}

export const useOnce = (id = 'default') => {
  const key = `timestamp-${id}`
  const timeLimit = 3 * 60 * 60 * 1000 // 3 hours
  const [timeHasPassed, setTimeHasPassed] = useState(true)

  useEffect(() => {
    const currTimestamp = Date.now()
    const storage = window.localStorage
    const timestamp = JSON.parse(storage.getItem(key) || '1000')
    if (currTimestamp - timestamp > timeLimit) {
      storage.setItem(key, currTimestamp.toString())
    } else {
      setTimeHasPassed(false)
    }
  }, [])

  return timeHasPassed
}

export const normalize = (i, length) => {
  const midpoint = Math.ceil(length / 2)
  if (i < midpoint) {
    return i % midpoint
  } else {
    return length - 1 - i
  }
}

export const contains = (set, subset) => {
  return set.every(element => subset.includes(element))
}
