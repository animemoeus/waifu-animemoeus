# Waifu AnimeMoeUs

Welcome to the **AnimeMoe API** GitHub repository! This project provides access to a collection of anime-themed images (waifus) with comprehensive metadata such as creator information, dimensions, and more.

### API Overview

Base URL: [https://api.animemoe.us/](https://api.animemoe.us/)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| **GET** | `/waifu/` | Retrieve a list of waifus, with pagination and filtering options (e.g., NSFW). |
| **GET** | `/waifu/random/` | Fetch a random waifu. |
| **GET** | `/waifu/image-id/` | Get details for a specific waifu by `image_id`. |

#### Example Responses

- **Waifu List** (`/waifu/`)
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
            
        ]
    }
    ```

- **Random Waifu** (`/waifu/random/`)
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

- **Waifu Detail** (`/waifu/:image_id/`)
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

### Parameters

- **`nsfw`** (`true`/`false`): Include or exclude NSFW content. Default: `false`.
- **`count`**: Set the number of results to return. Default: `20`.

### Usage Examples

- Fetch waifus with NSFW content excluded:
    ```bash
    curl -X GET "https://api.animemoe.us/waifu/?nsfw=false&count=20"
    ```

- Get a random waifu:
    ```bash
    curl -X GET "https://api.animemoe.us/waifu/random/"
    ```

- Fetch details for a specific waifu by `image_id`:
    ```bash
    curl -X GET "https://api.animemoe.us/waifu/856739291803287552/"
    ```

### Future Enhancements

- Adding authentication and rate limiting.
- Support for additional waifu-related queries (e.g., search by creator or tag).
- Enhanced filtering options (by dimension, popularity, etc.).
