from pyrogram import Client, filters, idle, types 
import re,requests
from pyrogram.types import InlineKeyboardButton,InlineKeyboardMarkup,ReplyKeyboardMarkup
bo ="12345abcd"#Token
app = Client(
    "as4",
    1234,#api_id
    "",#api_hash
    bot_token=bo,
    in_memory=True
)

chus = "WHX2X"
k = types.InlineKeyboardMarkup([[
    types.InlineKeyboardButton(f"W H X", url=f"t.me/{chus}")
]])

@app.on_message(filters.text & filters.private)
async def on_text(c: Client, m: types.Message):
    text = m.text
    if re.findall("((www\.|http://|https://)(www\.)*.*?(?=(www\.|http://|https://|$)))", text):
        url = re.findall("((www\.|http://|https://)(www\.)*.*?(?=(www\.|http://|https://|$)))", text)[0][0]
        print(url)
        if "t.me/" in url:
            if "c/" in url:
                return await m.reply("ارسل ربط من قناة عامه", quote=True)
            else:
                channel = url.split("t.me/")[1].split("/")[0]
                msg_id = int(url.split("t.me/")[1].split("/")[1])
                reply = await m.reply("انتظر ....", quote=True)
                msg = await c.get_messages(channel, msg_id)
                await reply.delete()
                try:
                    if msg.text:
                        return await m.reply(msg.text.html, quote=True, reply_markup=msg.reply_markup)
                except AttributeError:
                    pass
                if msg.media_group_id:
                    return await c.copy_media_group(m.chat.id, msg.chat.id, msg.id)
                if msg.media:
                    return await msg.copy(m.chat.id, reply_markup=msg.reply_markup)
        else:
            return await m.reply("لازم رابط منشور من قناة", quote=True)
    else:
        name = m.from_user.first_name
        usid = m.from_user.username

        start_string = f'''
                      مرحباََ بكَ <a href ='https://t.me/{usid}'>{name}</a>
              انا بوت نسخ محتوى من اي قنوات مقيدة الحفض المحتوى 
              فقط ارسل رابط المنشور من قناة عامة 
              مثال : <code>https://t.me/whx2x/10</code>
              <b>Developer : @MrRaph</b>
              '''
        return await m.reply(start_string.format(m.from_user.mention), reply_markup=k)

app.run()