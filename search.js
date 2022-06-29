import axios from 'axios'
import cheerio from 'cheerio'
import template from './template.js'
// import fs from 'fs'

const searchBook = []

const fetchSearchBook = async (word) => {
  try {
    const url = encodeURI(word)
    const { data } = await axios.get('https://readmoo.com/search/keyword?q=' + url + '&kw=' + url + '&page=1&st=true')
    const $ = cheerio.load(data)

    $('.listItem-box').each(function () {
      searchBook.push(
        [
          $(this).find('img').attr('data-lazy-original'),
          $(this).find('.caption a').attr('title'),
          ...$(this).find('.price').text().split(',')
        ]
      )
    })
  } catch (error) {
    console.log(error.message)
  }
}

const replySearchBook = (event) => {
  const bubbles = searchBook.map(book => {
    const bubble = JSON.parse(JSON.stringify(template))
    bubble.hero.url = book[0]
    bubble.body.contents[0].text = book[1]
    bubble.body.contents[1].text = book[2]
    return bubble
  })
  // console.log(JSON.stringify(bubbles, null, 2))
  // fs.writeFileSync('bubbles.json', JSON.stringify(bubbles, null, 2))
  event.reply([
    {
      type: 'flex',
      altText: '查詢成功',
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 10)
      }
    }
  ])
}

const resetBook = () => {
  if (searchBook !== 0) { searchBook.splice(0, searchBook.length) }
}
export default {
  searchBook,
  fetchSearchBook,
  replySearchBook,
  resetBook
}
