import 'dotenv/config'
import linebot from 'linebot'
import data from './data.js'
import search from './search.js'
import schedule from 'node-schedule'

data.fetchNewBook()
data.fetchHotBook()

schedule.scheduleJob('0 0 * * *', () => {
  data.fetchNewBook()
  data.fetchHotBook()
})

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', (event) => {
  if (data.newbook.length === 0) {
    event.reply('資料讀取中，請稍後再試')
  } else if (event.message.type === 'text') {
    if (event.message.text === '!new') {
      data.replyNewBook(event)
    }
    if (event.message.text === '!hot') {
      data.replyHotBook(event)
    }
    // if (event.message.text === 'text') {
    //   search.fetchSearchBook('AAABBCC')
    //   console.log('AAABBCC')
    //   search.replySearchbook(event)
    // }
  }
})
bot.on('message', async (event) => {
  if (event.message.type === 'text') {
    if (event.message.text) {
      await search.fetchSearchBook(event.message.text)
      search.replySearchBook(event)
      search.resetBook()
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
