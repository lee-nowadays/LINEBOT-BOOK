import axios from 'axios'
import cheerio from 'cheerio'
import template from './template.js'
// import fs from 'fs'

const newbook = []
const hotbook = []
const fetchNewBook = async () => {
  try {
    const { data } = await axios.get('https://readmoo.com/category/249/%E8%BC%95%E5%B0%8F%E8%AA%AA/?sort=1&page=1')
    const $ = cheerio.load(data)
    $('.listItem-box').each(function () {
      newbook.push(
        [
          $(this).find('img').attr('data-lazy-original'),
          $(this).find('.caption a').attr('title'),
          ...$(this).find('.price').text().split(',')
        ]
      )
    })
  } catch (error) {
    console.log(error)
  }
}

const replyNewBook = (event) => {
  const bubbles = newbook.map(book => {
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
      altText: '由新到舊輕小說',
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 10)
      }
    }
  ])
}

const fetchHotBook = async () => {
  try {
    const { data } = await axios.get('https://readmoo.com/category/249/%E8%BC%95%E5%B0%8F%E8%AA%AA/?sort=3&page=1')
    const $ = cheerio.load(data)
    $('.listItem-box').each(function () {
      hotbook.push(
        [
          $(this).find('img').attr('data-lazy-original'),
          $(this).find('.caption a').attr('title'),
          ...$(this).find('.price').text().split(',')
        ]
      )
    })
  } catch (error) {
    console.log(error)
  }
}

const replyHotBook = (event) => {
  const bubbles = hotbook.map(book => {
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
      altText: '30天暢銷榜',
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 10)
      }
    }
  ])
}
export default {
  newbook,
  hotbook,
  fetchNewBook,
  replyNewBook,
  fetchHotBook,
  replyHotBook
}
