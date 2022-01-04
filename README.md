<center><h1>Waifu AnimeMoeUs</h1></center>

---

[![Netlify Status](https://api.netlify.com/api/v1/badges/1ae96868-4f6d-449c-85b8-56163c5f5a2b/deploy-status)](https://app.netlify.com/sites/waifu-animemoeus/deploys)

---

### Endpoint:

`https://api.animemoe.us/`

---

### Allowed Method:

`GET`

---

### Paths:

| Path               | Params | Value          | Default |
| ------------------ | ------ | -------------- | ------- |
| `/waifu/`          | `nsfw` | `true`/`false` | `false` |
| `/waifu/`          | `count` |               | `20`    |
| `/waifu/random/`   |
| `/waifu/image-id/` |

---

#### Waifu

```
https://api.animemoe.us/waifu/
```

```json
{
    "count": 14043,
    "next": "http://api.animemoe.us/waifu/?page=2",
    "previous": null,
    "results": [
        {
            "id": 14056,
            "image_id": "856740902361235486",
            "thumbnail": "https://cdn.discordapp.com/attachments/752705854934876234/856740902361235486/waifu-animemoeus.jpg",
            "creator_name": "しま次郎",
            "width": 848,
            "height": 1200
        },
        {
            "id": 14055,
            "image_id": "856740853862891530",
            "thumbnail": "https://cdn.discordapp.com/attachments/752705854934876234/856740853862891530/waifu-animemoeus.jpg",
            "creator_name": "Ginn",
            "width": 1200,
            "height": 655
        },
        ...,
        {
            "id": 14038,
            "image_id": "856739197527130172",
            "thumbnail": "https://cdn.discordapp.com/attachments/752705854934876234/856739197527130172/waifu-animemoeus.jpg",
            "creator_name": "ひゅらさん🍜",
            "width": 922,
            "height": 1200
        },
        {
            "id": 14037,
            "image_id": "856739150069235732",
            "thumbnail": "https://cdn.discordapp.com/attachments/752705854934876234/856739150069235732/waifu-animemoeus.jpg",
            "creator_name": "らま@イラストお仕事募集中",
            "width": 855,
            "height": 1199
        }
    ]
}
```

---

#### Random Waifu

```
https://api.animemoe.us/waifu/random/
```

```json
{
  "id": 11583,
  "image_id": "649450620639723520",
  "original_image": "https://64.media.tumblr.com/df93f22e3461a4c3aa8fe78b5315859b/c4539d6c4e9c9934-c7/s1280x1920/a963afdebdd705562cb1ab45cd2d04c58d27b15b.jpg",
  "thumbnail": "https://64.media.tumblr.com/df93f22e3461a4c3aa8fe78b5315859b/c4539d6c4e9c9934-c7/s540x810/4f7a0d0a07fbd8ac748ae4660dd3d74c11cb153a.jpg",
  "creator_name": "月うさぎ＠お仕事skeb募集",
  "creator_username": "tukiman02",
  "caption": "うちの娘2「ベリー」ちゃん\n「んにゃ～もう朝にゃ～？」",
  "source": "https://t.co/oPO7rgnmTq",
  "width": 1200,
  "height": 801
}
```

---

#### Waifu Detail

```
https://api.animemoe.us/waifu/image-id/
https://api.animemoe.us/waifu/856739291803287552/
```

```json
{
  "id": 14041,
  "image_id": "856739291803287552",
  "original_image": "https://cdn.discordapp.com/attachments/752705854934876234/856739291803287552/waifu-animemoeus.jpg",
  "thumbnail": "https://cdn.discordapp.com/attachments/752705854934876234/856739291803287552/waifu-animemoeus.jpg",
  "creator_name": "torino",
  "creator_username": "TorinoAqua",
  "caption": "ショッピングの帰りにぬいぐるみを取ってあげたらものすごく喜んでくれるミホノブルボンさん",
  "source": "https://t.co/Rf7SOd46BJ",
  "width": 756,
  "height": 1200
}
```
