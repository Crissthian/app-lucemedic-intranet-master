const formatFullName = (text: string): string => {
  const words = text.split(' ')

  const formattedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  return formattedWords.join(' ')
}

export { formatFullName }
